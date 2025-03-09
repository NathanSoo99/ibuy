import server
import json
import base64
from random import randrange
from error import InputError, AccessError

def helper_suggestion(token):
    """
    Helper gives its product suggestion to the user

    Params:
        token (str): unique client identifier

    Returns:
        suggestion (dict): product content
    """
    #Attempt to load suggestions list for user
    u_id = server.get_user_from_token(token)
    helpers = load_helper_session(u_id)
    suggestions = load_suggestions(u_id, helpers)

    #Wipe the users session from database
    i = 0
    flag = 0
    for helper in helpers:
        if u_id == helper["u_id"]:
            index = i
            flag = 1
        i = i + 1
    
    if flag == 1:
        del helpers[index]

    server.write_data(server.HELPER_FILE, helpers)

    #Send product from list still in memory
    if len(suggestions) != 0:
        #Determine range of how many products are left
        ceiling = len(suggestions) - 1

        #Choose one because there aren't enough data points to get any more specific >:|
        if ceiling == 0:
            product_index = 0
        else:
            product_index = randrange(0,ceiling)

        #Create product info to send
        ans_id = suggestions[product_index]["product_id"]
        ans_name = suggestions[product_index]["name"]

        img_path = f"picture/{ans_id}_profile.png"
        try:
            with open(img_path, 'rb') as picture:
                picString = picture.read()
                base_data = base64.b64encode(picString)
                base_message = "data:image/png;base64," + base_data.decode('utf-8')
        except IOError:
            base_message = ""
            print("aaa")

        ans_pic = base_message

        product_suggestion = {
            "id": ans_id,
            "name": ans_name,
            "pic": ans_pic
        }
        return product_suggestion

    else:
        product_suggestion = {
            "id": -1,
            "name": "No match found",
            "pic": ""
        }
        return product_suggestion


def price_question(token, max_price, min_price):
    """
    QUESTION 1
    Eliminates products from the suggestion list based on the
    maximum and minimum price a user wants to spend

    Params:
        token (str):        unique client identifier
        max_price (int):    max price to spend
        min_price (int):    min price to spend
    
    Returns:
        suggestions (lst): updated list of suggest products
    """
    #Attempt to load suggestions list for user
    u_id = server.get_user_from_token(token)
    helpers = load_helper_session(u_id)
    suggestions = load_suggestions(u_id, helpers)

    delete_index = []
    delete_index = max_cutoff(max_price, suggestions)
    
    #Reverse list
    delete_index = delete_index[::-1]

    #Delete index from suggestions
    for index in delete_index:
        del suggestions[index]


    delete_index = []

    delete_index = min_cutoff(min_price, suggestions)
    
    #Reverse list
    delete_index = delete_index[::-1]

    #Delete index from suggestions
    for index in delete_index:
        del suggestions[index]

    #Write changes to helper file
    update_helper_file(u_id, suggestions)

    return {}

def max_cutoff(price, suggestions):
    """
    Return indicies of which products need to be removed

    Params:
        price (int):        price cutoff
        suggestions (lst):  products being suggested

    Returns:
        delete_index (lst): index of products to be deleted
    """
    delete_index = []

    i = 0
    for product in suggestions:
        if int(product["price"]) > price:
            delete_index.append(i)
        i = i + 1

    return delete_index

def min_cutoff(price, suggestions):
    """
    Return indicies of which products need to be removed

    Params:
        price (int):        price cutoff
        suggestions (lst):  products being suggested

    Returns:
        delete_index (lst): index of products to be deleted
    """
    delete_index = []

    i = 0
    for product in suggestions:
        if int(product["price"]) < price:
            delete_index.append(i)
        i = i + 1

    return delete_index



def stock_question(token, stock):
    """
    QUESTION 2
    Eliminates products from the suggestion list based
    on if they are out of stock or not

    Params:
        token (str):    unique client identifier
        stock (bool):   yes if they need it in stock, no if it doesnt matter

    Returns
        None
    """
    #Attempt to load suggestions list for user
    u_id = server.get_user_from_token(token)
    helpers = load_helper_session(u_id)
    suggestions = load_suggestions(u_id, helpers)

    delete_index = []
    #Only need to remove in case they care about stock
    if stock == True:
        i = 0
        for product in suggestions:
            if int(product["stock"]) <= 0:
                delete_index.append(i)
            i = i + 1

    #Reverse list
    delete_index = delete_index[::-1]

    #Delete index from suggestions
    for index in delete_index:
        del suggestions[index]

    #Write changes to helper file
    update_helper_file(u_id, suggestions)

    return {}




def category_question(token, specificity, category_choice):
    """
    QUESTION 3
    Eliminates products from suggestion list based on 
    the categories they fall under. Exact specificity means
    that all categories selected must be present on a product
    to not be eliminated, any specificity means at least one
    of the categories selected must be present on a product to
    not be eliminated

    Params:
        token (str):            unique client identifier
        specificity (str):      either "exact" or "any"
        category_choice (lst):  strings saying what categories client likes

    Returns:
        None
    """
    #Attempt to load suggestions list for user
    u_id = server.get_user_from_token(token)
    helpers = load_helper_session(u_id)
    suggestions = load_suggestions(u_id, helpers)

    delete_index = []
    if specificity == "exact":
        delete_index = exact_category(category_choice, suggestions)
    elif specificity == "any":
        delete_index = any_category(category_choice, suggestions)
    
    #Reverse list
    delete_index = delete_index[::-1]

    #Delete index from suggestions
    for index in delete_index:
        del suggestions[index]

    #Write changes to helper file
    update_helper_file(u_id, suggestions)

    return {}

def get_categories(token):
    """
    For a user, find what categories correlate to remaining products in their
    helper session

    Params:
        token (str): unique identifier of a user

    Returns:
        cats (set): set of categories present
    """
    #Attempt to load suggestions list for user
    u_id = server.get_user_from_token(token)
    helpers = load_helper_session(u_id)
    suggestions = load_suggestions(u_id, helpers)

    all_remaining_categories = []
    for p in suggestions:
        for c in p["categories"]:
            all_remaining_categories.append(c)

    cats = set(all_remaining_categories)

    return cats
    

def exact_category(category_choice, suggestions):
    """
    List the indices of products in suggestions list
    that don't have all specific categories in them

    Params:
        category_choice (lst):  categories user wants
        suggestions (lst):      suggested products

    Returns
        delete_index (lst): indices of products 
    """

    i = 0
    delete_index = []

    for product in suggestions: #Go through every product
        flag = 0
        for category in category_choice: #Check every desired category is in the products tags
            if category not in product["categories"]:
                flag = 1 #If category not present, we mark this product as needing to be deleted
        if flag == 1:
            delete_index.append(i)
        i = i + 1

    return delete_index

def any_category(category_choice, suggestions):
    """
    List the indices of products in suggestions list
    that don't have any specific categories in them

    Params:
        category_choice (lst):  categories user wants
        suggestions (lst):      suggested products

    Returns
        delete_index (lst): indices of products 
    """
    i = 0
    delete_index = []

    for product in suggestions: #Go through every product
        flag = 0
        for category in category_choice: #Check any desired category is in the products tags
            if category in product["categories"]:
                flag = 1 #If category present, we dont want to delete it
        if flag == 0:
            delete_index.append(i)
        i = i + 1

    return delete_index

def load_helper_session(u_id):
    """
    Returns helper session file data, adds an entry for current user
    if they have no session in progress. Also commits new entry to database

    Params:
        u_id (int): unique client identifier

    Returns:
        helpers (lst): all session data from the helper file
    """
    helpers = server.read_data(server.HELPER_FILE)
    suggestions = []
    flag = 0
    for helper in helpers:
        if u_id == helper["u_id"]: #Helper session exists
            flag = 1

    if flag == 0: #Helper session does not exist, create one
        products = server.read_data(server.PRODUCTS_FILE)
        helpers.append({
            "u_id": u_id,
            "suggestions": products
        })

    server.write_data(server.HELPER_FILE, helpers)        

    return helpers

def load_suggestions(u_id, helpers):
    """
    Returns the products currently in suggestion list for a users helper session

    Params:
        u_id (int):     unique client identifier
        helpers (lst):  data from the helper file

    Returns:
        suggestions (lst): list of products
    """
    suggestions = []
    flag = 0
    for entry in helpers:
        if entry["u_id"] == u_id:
            suggestions = entry["suggestions"]
            flag = 1

    if flag == 0:
        raise AccessError(description=f'Invalid could not find an entry for user {u_id} in HELPER FILE')

    return suggestions

def update_helper_file(u_id, suggestions):
    """
    Updates a users suggestion list

    Params:
        u_id (int):         unique client identifier
        suggestions (lst):  list of products

    Returns:
        None
    """
    helpers = server.read_data(server.HELPER_FILE)

    for entry in helpers:
        if entry["u_id"] == u_id:
            entry["suggestions"] = suggestions

    server.write_data(server.HELPER_FILE, helpers)

    return

