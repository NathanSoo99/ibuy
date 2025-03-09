import server
import query
import hashlib

def add_credit_card(token, card_number, cvc, expiry_date, name):
    """
    Adds new encrypted credit card information to the backend.

    Params:
        token (str):        unique token used to identify a client
        card_number (str):  credit card number
        cvc (str):          cvc security number
        expiry_date (str):  expiration date of card
        name (str):         name on the card

    Returns:
        id (int): id unique to the cc information
    """
    #Verify real user and get u_id
    u_id = server.get_user_from_token(token)

    #Access database for user
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.account_index(u_id)

    #Create new_id for cc based off how many are already in list
    new_id = accounts[index]["newest_cc"] + 1
    accounts[index]["newest_cc"] = new_id

    #Trim cc number to get suffix (last 4 num)
    suffix = card_number[-4:]

    #Make cc_hash by hashing all info
    cc_info = card_number + cvc + expiry_date + name 
    cc_hash = hashlib.sha256(cc_info.encode()).hexdigest()

    #Append cc info to their credit_cards list
    new_card = {
        "id": new_id,
        "card_suffix": suffix,
        "expiry_date": expiry_date,
        "name": name,
        "hash": cc_hash
    }
    accounts[index]["credit_cards"].append(new_card)

    server.write_data(server.ACCOUNTS_FILE, accounts)

    #Return id
    return {
        "id": new_id
    }

def delete_credit_card(token, cc_id):
    """
    Remove encrypted credit card information from the backend.

    Params:
        token (str):        unique token used to identify a client
        id (int): id unique to the cc information

    Returns:
        none
    """
    #Verify real user and get u_id
    u_id = server.get_user_from_token(token)

    #Access database for user
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.account_index(u_id)

    #Delete cc entry with matching id from list
    i = 0
    for credit_card in accounts[index]["credit_cards"]:
        if credit_card["id"] == cc_id:
            del accounts[index]["credit_cards"][i]
            break
        i = i + 1

    

    server.write_data(server.ACCOUNTS_FILE, accounts)

    return {}

def get_credit_cards(token):
    """
    Return list of credit cards associated with a particular account 

    Params:
        token (str):    unique token used to identify a client

    Returns:
        cc_info (list): contains dictionaries which store the data for each
                        credit card that is saved to a users account
    """
    #Verify real user and get u_id
    u_id = server.get_user_from_token(token)

    #Access database for user
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.account_index(u_id)

    #return saved cc info
    cc_info = accounts[index]['credit_cards']

    return cc_info

def add_address(token, full_name, number, street_address, postcode, country, state, suburb, post_default, bill_default):
    """
    Adds new building address information to the backend.

    Params:
        token (str):            unique token used to identify a client
        full_name (str):        name of resident
        number (int):           phone number of resident
        street_address (str):   number of building and name of street
        suburb (str):           suburb street is located in
        postcode (int):         numerical postcode of address
        state (str):            state of residence
        country (str):          country of residence
        post_default (bool):    whether this is the default address to post orders to
        bill_default (bool):    whether this is the default address to bill orders to
        
    Returns:
        id (int): id unique to the address information
    """
    #Verify real user and get u_id
    u_id = server.get_user_from_token(token)

    #Access database for user
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.account_index(u_id)

    #Create new_id for address based off how many are already in list
    new_id = accounts[index]["newest_address"] + 1
    accounts[index]["newest_address"] = new_id

    #Append cc info to their credit_cards list
    new_address = {
        "id": new_id,
        "full_name": full_name,
        "number": number,
        "address": street_address,
        "postcode": postcode,
        "country": country,
        "state": state,
        "suburb": suburb,
        "post_default": post_default,
        "bill_default": bill_default
    }
    accounts[index]["addresses"].append(new_address)

    server.write_data(server.ACCOUNTS_FILE, accounts)

    #Return id
    return {
        "id": new_id
    }

def delete_address(token, address_id):
    """
     Remove address information from the backend.

    Params:
        token (str):    unique token used to identify a client
        id (int):       id unique to the address information

    Returns:
        none
    """
    #Verify real user and get u_id
    u_id = server.get_user_from_token(token)

    #Access database for user
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.account_index(u_id)

    #Delete address entry with matching id from list
    i = 0
    for address in accounts[index]["addresses"]:
        if address["id"] == int(address_id):
            del accounts[index]["addresses"][i]
            break
        i = i + 1
    
    

    server.write_data(server.ACCOUNTS_FILE, accounts)

    return {}

def get_addresses(token):
    """
    Return list of addresses associated with a particular account 

    Params:
        token (str):    unique token used to identify a client

    Returns:
        address_info (list):    contains dictionaries which store the data for each
                                address that is saved to a users account
    """
    #Verify real user and get u_id
    u_id = server.get_user_from_token(token)

    #Access database for user
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.account_index(u_id)

    #return saved cc info
    address_info = accounts[index]['addresses']

    return address_info

def modify_address(token, address_id, full_name, number, street_address, postcode, country, state, suburb, post_default, bill_default):
    """
    Modify existing address data in the backend.

    Params:
        token (str):            unique token used to identify a client
        address_id (int):       unique id of the address we want to edit
        full_name (str):        name of resident
        number (int):           phone number of resident
        street_address (str):   number of building and name of street
        suburb (str):           suburb street is located in
        postcode (int):         numerical postcode of address
        state (str):            state of residence
        country (str):          country of residence
        post_default (bool):    whether this is the default address to post orders to
        bill_default (bool):    whether this is the default address to bill orders to
        
    Returns:
        none
    """
    #Verify real user and get u_id
    u_id = server.get_user_from_token(token)

    #Access database for user
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.account_index(u_id)

    #Modifies address entry with matching id from list
    for address in accounts[index]["addresses"]:
        if address['id'] == address_id:
            address['full_name'] = full_name
            address['number'] = number
            address['street_address'] = street_address
            address['postcode'] = postcode
            address['country'] = country
            address['state'] = state
            address['suburb'] = suburb
            address['post_default'] = post_default
            address['bill_default'] = bill_default
        

    server.write_data(server.ACCOUNTS_FILE, accounts)

    return {}

#THESE REQUIRE SOME SORT OF WRAPPER FUNC TO INTERFACE WITH FRONTEND (Not clear how completing an order works yet)
def pay_with_wallet(u_id, price):
    """
    For a given price, reduces said amount from wallet balance.

    Params:
        u_id (int):     unique identifier of account making purchase
        price (int):    price of product being bought
    
    Returns:
        remaining (int): amount of money outstanding to complete the transaction
    """
    #Access database for user
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.account_index(u_id)

    #Calculate balance after transaction
    balance = accounts[index]['wallet_balance']
    balance = balance - price

    
    if balance < 0: #Case where not enough money
        remaining = -1 * balance
        accounts[index]['wallet_balance'] = 0
    else: #Case where enough money
        remaining = 0
        accounts[index]['wallet_balance'] = balance

    return remaining

def pay_with_cc(u_id, cc_id, price):
    """
    For a given price, magically pay for it with a credit card

    Params:
        u_id (int):     unique identifier of customer account
        cc_id (int):    unique identifier of credit card entry
        price (int):    cost of item

    Returns:
        remaining (int): amount of money outstanding to complete the transaction
    """
    #Access database for user
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.account_index(u_id)

    #This way if card not found, the money owed will still exist
    #Should prevent issues where money is removed from wallet
    #but then the transcation cancels because card is not found
    remaining = price

    #Check cc_id exist and then pay for item
    flag = 0
    for cc in accounts[index]["credit_cards"]:
        if cc["id"] == cc_id:
            remaining = 0

    return remaining