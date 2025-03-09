import server
import re
from error import AccessError, InputError

def find_email(email):
    """
    Searches account database for a matching email address.

    Returns:
        True - If email exists
        None - If email does not exist
    """
    accounts = server.read_data(server.ACCOUNTS_FILE)

    email_list = [a['email'] for a in accounts]
    if email in email_list:
        return True

    return False


def account_index(u_id):
    """
    Finds the index of the account with u_id in the JSON list of accounts.

    Returns:
        None        - If no such u_id exists
        index (int) - If u_id is found
    """
    accounts = server.read_data(server.ACCOUNTS_FILE)
    for index, account in enumerate(accounts):
        if account['u_id'] == u_id:
            return index
    
    return None
    
def get_account_u_id(email):
    """
    Finds the u_id of an account associated with an email.

    Returns:
        None        - If no email exists
        u_id (int)  - Account user id if email is found
    """
    accounts = server.read_data(server.ACCOUNTS_FILE)

    for account in accounts:
        if account['email'] == email:
            return account['u_id']
    
    return None

def get_account_password_with_email(email):
    """
    Finds the hashed password of an account associated with an email.

    Returns:
        None            - If no email exists
        password (str)  - Accounts hashed password if email is found
    """
    accounts = server.read_data(server.ACCOUNTS_FILE)

    for account in accounts:
        if account['email'] == email:
            return account['pass_hash']
    
    return None


def get_account_password_with_id(u_id):
    """
    Finds the hashed password of an account associated with a u_id.

    Returns:
        None            - If no u_id exists
        password (str)  - Accounts hashed password if u_id is found
    """
    accounts = server.read_data(server.ACCOUNTS_FILE)

    for account in accounts:
        if account['u_id'] == u_id:
            return account['pass_hash']
    
    return None

def account_index_from_reset_code(reset_code):
    """
    Finds the index of the user with reset code in the JSON list of users.

    Returns:
        None:       if no such reset code exists
        i (int):    index of account with matching reset code
    """

    accounts = server.read_data(server.ACCOUNTS_FILE)
    for i, account in enumerate(accounts):
        if account['reset_code'] == reset_code:
            return i
    return None

def check_email_format(email):
    """
    For a given email, makes sure it is two strings split by an '@'

    Params:
        email (str): email being analysed

    Raises:
        InputError: if email is wrong format
    """
    regex = '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$' #pylint: disable=anomalous-backslash-in-string
    if not re.search(regex, email):
        raise InputError(description='email is invalid')

    return

def user_index_from_email(email):
    """
    Finds the index of the user with email in the JSON list of users.
    
    Params:

    Returns:
        None:       if no such email exists
        i (int):    if email exists
    """

    accounts = server.read_data(server.ACCOUNTS_FILE)
    for i, account in enumerate(accounts):
        if account['email'] == email:
            return i
    return None

def user_viewed_products(u_id):
    """
    Returns the list of the 20 most recently viewed products of a 
    given user

    Params:
        u_id (int): unique indentifier of user account

    Returns:
        products (list): ids of products viewed
    """
    accounts = server.read_data(server.ACCOUNTS_FILE)
    for i, account in enumerate(accounts):
        if account["u_id"] == u_id:
            return account["products_viewed"]
    return []

def product_categories(product_id): #TODO make product categories be a list not a str
    """
    For a given product, return the list of its categories

    Params:
        product_id (int): unique identifier of product

    Returns:
        categories (list): strings denoting categories
    """
    #This search is faster than a for loop, but only works so
    #long as we NEVER delete products from list (would mess up index offset),
    #so change to for loop if we do that
    products = server.read_data(server.PRODUCTS_FILE)
    product = products[int(product_id) - 1]

    categories = product["categories"]

    return categories
