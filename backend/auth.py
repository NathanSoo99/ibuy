import query
import server
import string
import hashlib
from random import randrange, choice
from error import AccessError, InputError
from Google import Create_Service
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

INACTIVE = 0
ACTIVE = 1


def register(email, first_name, last_name, password, referral_code):
    """
    Registers a new account when given a full name, email and password.

    Params:
        email (str):            New account owners email
        first_name (str):       New account owners first name
        last_name (str)         New account owners last name
        password (str):         Hashed password of user
        referral_code (int):    Unique code of another user (0 indicates no code was supplied)

    Returns:
        u_id (int):         Unique "user id" for the account
        token (str):        Auth token stored in end-users cookies

    Raises:
        Input error:    If email in use
                        If email invalid format (str)@(str)
    """

    #Check for existing email
    if query.find_email(email) is True:
        raise InputError(description='Email address already in use')

    #Check email is right format
    query.check_email_format(email)

    #Update newest u_id and assign it to account
    ids = server.read_data(server.U_ID_FILE)
    ids['newest_u_id'] = ids['newest_u_id'] + 1
    u_id = ids['newest_u_id']

    #sanitise referral code
    if referral_code.isdigit() == False and referral_code != '':
        raise InputError(description='Referral code is not numerical')

    if referral_code == '':
        referral_code = 0

    

    server.write_data(server.U_ID_FILE, ids)
    

    #Add account to database
    accounts = server.read_data(server.ACCOUNTS_FILE)
    accounts.append({
        'u_id': u_id,
        'email': email,
        'first_name': first_name,
        'last_name': last_name,
        'pass_hash': hashlib.sha256(password.encode()).hexdigest(),
        'jwt_ver': ACTIVE,
        'is_admin': False,
        'reset_code': "",
        'wallet_balance': 0,
        'personal_referral_code':randrange(1,9999999),
        'friend_referral_code': int(referral_code),
        'newest_cc': 0,
        'credit_cards': [],
        "newest_address": 0,
        "addresses": [],
        "products_viewed": []
    })
    server.write_data(server.ACCOUNTS_FILE, accounts)

    token = server.generate_token(u_id, ACTIVE)

    return {
        'u_id': u_id,
        'token': token,
    }

def login(email, password):
    """
    Given a user's email and password, logs the user into their account and
    generates a valid token for the user to remain authenticated.

    Params:
        email (str):    the email that the user registered with
        password (str): the password that the user entered when registering

    Returns:
        u_id (int):     the user ID used tied to the user
        token (str):    a token that enables the user to remain authenticated

    Raises:
        InputError  - If email is invalid
                    - If password is invalid

    """
    
    if query.find_email(email) is False:
        raise InputError(description='Invalid account details')

    #Get necessary account data
    #(This is probably a slow way to do this but will not matter for size of project)
    u_id = query.get_account_u_id(email)
    hashed_pwd = query.get_account_password_with_email(email)

    #check the password entered by the user matches the hashed password
    if hashed_pwd != hashlib.sha256(password.encode()).hexdigest():
        raise InputError(description="Invalid account details")

    #generate an active token which represents a logged in user
    token = server.generate_token(u_id, ACTIVE)

    #set the token for this user on the server to be ACTIVE
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.account_index(u_id)

    accounts[index]['jwt_ver'] = ACTIVE
    wallet_balance = accounts[index]['wallet_balance']

    #write this data to the server
    server.write_data(server.ACCOUNTS_FILE, accounts)

    return {
        'u_id': u_id,
        'token': token,
        'wallet_balance': wallet_balance
    }


def logout(token):
    """
    Given an active token, the token is invalidated to log out the user.

    Params:
        token (str): the authorization token stored in the user's cookies

    Returns:
        is_success (bool):
            - if a valid token is given: the user is logged out successfully and return True
            - if an invalid token is given: return False
    """

    try:
        u_id = server.get_user_from_token(token)
    except AccessError:
        return {
            'is_success' : False
        }

    #set the token on the server to be INACTIVE
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.account_index(u_id)

    accounts[index]['jwt_ver'] = INACTIVE

    server.write_data(server.ACCOUNTS_FILE, accounts)

    return {
        'is_success' : True
    }

def reset_request(email):
    """
    A secret code is randomly generated and sends the user an email (to the email address entered)
    containing the secret code that will enable password reset.
    Params:
        email (str): the user enters an email that they used to register for an account
    Returns:
        None
    Raises:
        InputError: If invalid email address is entered
    """

    if query.find_email(email) == False:
        raise InputError(description='Email not associated with any account')

    # Create random str for reset_code - https://pynative.com/python-generate-random-string/
    characters = string.ascii_letters + string.digits
    reset_code = ''.join(choice(characters) for i in range(8))

    # Email reset code out
    # Code from https://learndataanalysis.org/how-to-use-gmail-api-to-send-an-email-in-python/
    CLIENT_SECRET_FILE = 'data/client_secret.json'
    API_NAME = 'gmail'
    API_VERSION = 'v1'
    SCOPES = ['https://mail.google.com/']

    service = Create_Service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)

    emailMsg = 'Hello IBUY customer. Your reset code is: ' + reset_code
    mimeMessage = MIMEMultipart()
    mimeMessage['to'] = email
    mimeMessage['subject'] = 'IBUY password reset request'
    mimeMessage.attach(MIMEText(emailMsg, 'plain'))
    raw_string = base64.urlsafe_b64encode(mimeMessage.as_bytes()).decode()

    message = service.users().messages().send(userId='me', body={'raw': raw_string}).execute()

    # Add reset code to account data
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.user_index_from_email(email)
    accounts[index]['reset_code'] = reset_code

    server.write_data(server.ACCOUNTS_FILE, accounts)

    return {}

def password_reset(reset_code, new_password):
    """
    Given a reset code, enables the user to enter a new password for their account.

    Params:
        reset_code (str):   unique reset code, is a random str 8 char long
        new_password (str): new password for account

    Raises:
        InputError: given reset_code is not a valid reset code
    """

    accounts = server.read_data(server.ACCOUNTS_FILE)

    # Check that reset code is valid (raises InputError)
    reset_code_list = [r['reset_code'] for r in accounts]
    if reset_code not in reset_code_list:
        raise InputError(description='Invalid reset code')

    # Grab user information using reset code and change password
    index = query.account_index_from_reset_code(reset_code)
    accounts[index]['pass_hash'] = hashlib.sha256(new_password.encode()).hexdigest()
    accounts[index]['reset_code'] = ""

    server.write_data(server.ACCOUNTS_FILE, accounts)

    return {}