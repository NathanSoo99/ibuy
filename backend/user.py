import random
import admin
import hashlib
import string
import server
import query
import error


from Google import Create_Service
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def user_profile(token):
    """
    For a valid account, returns information about their
    email, first name, last name
    Params:
        token (str): unique token to authorise user
    Returns:
        profile (dict): Contains email (str), rirst_name (str), last_name (str)
    """

    #Find u_id from the given token
    u_id = server.get_user_from_token(token)

    #Get account from server file
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.account_index(u_id)

    #Create account dict
    profile = {}
    profile['email'] = accounts[index]['email']
    profile['firstName'] = accounts[index]['first_name']
    profile['lastName'] = accounts[index]['last_name']
    profile['referralCode'] = accounts[index]['personal_referral_code']

    return profile

def user_profile_set_name(token, first_name, last_name):
    """
    Update the authorised user's first and last name
    Params:
        token (str):        unique token to authorise user
        first_name (str):   new first name to be set on account
        last_name (str):    new last name to be set on account
    Raises:
        InputError: If name contains punctuation or digits
    """
    #Remove unnecessary whitespace
    first_name = first_name.strip(' ')
    last_name = last_name.strip(' ')

    #Ensure name break no rules
    specials = set(string.punctuation)
    if any(char in specials for char in first_name):
        raise InputError(description='first_name contains an invalid special character')

    if any(char in specials for char in last_name):
        raise InputError(description='last_name contains an invalid special character')

    numbers = set(string.digits)
    if any(char in numbers for char in first_name):
        raise InputError(description='first_name contains an invalid numerical character')

    if any(char in numbers for char in last_name):
        raise InputError(description='last_name contains an invalid numerical character')

    #Find u_id from the given token
    u_id = server.get_user_from_token(token)

    #Get account info
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.account_index(u_id)

    #Modify the corresponding parts of profile
    accounts[index]['first_name'] = first_name
    accounts[index]['last_name'] = last_name

    #Write changes to the server
    server.write_data(server.ACCOUNTS_FILE, accounts)

    return {}

def user_profile_set_email(token, email):
    """
    Update the authorised user's email address
    Params:
        token (str): unique token to authorise user
        email (str): new email to be set on account
    Raises:
        InputError: If email doesn't conform to (str)@(str) format
                    If email already in use on any account
    """
    #Check that email is correct format
    query.check_email_format(email)

    #Find u_id from the given token
    u_id = server.get_user_from_token(token)

    #Grabs the users info from users.json
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.account_index(u_id)

    #Checks email is not already in use
    for account in accounts:
        if account['email'] == email:
            raise InputError(description='email is in use')

    #Modify the corresponding parts of profile
    accounts[index]['email'] = email

    #Write changes to the server
    server.write_data(server.ACCOUNTS_FILE, accounts)

    return {}

def user_profile_set_password(token, curr_password, new_password):
    """
    Update the authorised user's password
    Params:
        token (str):            unique token to authorise user
        curr_password (str):    the password on account right now
        new_password (str):     new password to be set on account
    Raises:
        InputError: If curr_password does not match existing password on account
    """

    #Find u_id from the given token
    u_id = server.get_user_from_token(token)

    #Grabs the users info from users.json
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.account_index(u_id)

    #Compare old password
    hashed_pwd = query.get_account_password_with_id(u_id)

    if hashed_pwd != hashlib.sha256(curr_password.encode()).hexdigest():
        raise InputError(description="Invalid account details")

    #Modify the corresponding parts of profile
    accounts[index]['pass_hash'] = hashlib.sha256(new_password.encode()).hexdigest()

    #Write changes to the server
    server.write_data(server.ACCOUNTS_FILE, accounts)

    return {}


def create_gift_code(value, email):
    """
    Create a new gift code, add it to the database and email it 
    to the customer

    Params:
        value (int): amount of money on the card
        email (str):  email the code will be sent to
    
    Returns:
        none
    """
    #Generate a new code 10 characters long
    #Create random str for reset_code - https://pynative.com/python-generate-random-string/
    characters = string.ascii_letters + string.digits
    gift_code = ''.join(random.choice(characters) for i in range(10))

    new_code = {
        "code": gift_code,
        "value": value
    }

    # Add gift code to database
    codes = server.read_data(server.GIFTCODE_FILE)
    codes.append(new_code)
    server.write_data(server.GIFTCODE_FILE, codes)

    # Email gift code out
    # Code from https://learndataanalysis.org/how-to-use-gmail-api-to-send-an-email-in-python/
    CLIENT_SECRET_FILE = 'data/client_secret.json'
    API_NAME = 'gmail'
    API_VERSION = 'v1'
    SCOPES = ['https://mail.google.com/']

    service = Create_Service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)

    emailMsg = f'Hello IBUY customer. Thank you for your purchase. Your giftcode for ${value} is: ' + gift_code
    mimeMessage = MIMEMultipart()
    mimeMessage['to'] = email
    mimeMessage['subject'] = 'IBUY gift code receipt'
    mimeMessage.attach(MIMEText(emailMsg, 'plain'))
    raw_string = base64.urlsafe_b64encode(mimeMessage.as_bytes()).decode()

    message = service.users().messages().send(userId='me', body={'raw': raw_string}).execute()

    return {}

def redeem_gift_code(token, gift_code):
    """
    For a supplied code, attempt to redeem it to the database

    Params:
        token (str): unique token authenticating a user
        code (str):  the code that will be redeemed on the account

    Returns:
        code_status (str): Whether code was redeemed or not
    """
    #Find u_id from the given token
    u_id = server.get_user_from_token(token)

    #Grabs the users info from users.json
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.account_index(u_id)

    #Look for code
    codes = server.read_data(server.GIFTCODE_FILE)
    for code in codes:
        if code["code"] == gift_code:
            #Update wallet and delete code
            money = code["value"]
            accounts[index]["wallet_balance"] = accounts[index]["wallet_balance"] + money
            codes.remove(code)
            server.write_data(server.ACCOUNTS_FILE, accounts)
            server.write_data(server.GIFTCODE_FILE, codes)
            return f"Code Redeemed. Added ${money} to your balance."

    

    return "Code Invalid"

def get_wallet_balance(token):
    """
    Returns the wallet balance of a given user

    Params:
        token (str): authenticating token of client

    Returns
        response: dict containing the balance of users wallet
    """
    #Find u_id from the given token
    u_id = server.get_user_from_token(token)

    #Grabs the users info from users.json
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.account_index(u_id)

    #Get balance
    balance = accounts[index]["wallet_balance"]
    
    response = {
        "balance" : balance
    }

    return response