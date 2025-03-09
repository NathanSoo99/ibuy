import server
import query
import base64


def construct_recommended_list(token):
    """
    Takes in an accounts token and returns the ids of the 10
    products most closely related .

    Params:
        token (str): unique token identifying a front end client

    Returns:
        recommended_products (lst): product_ids of recommended products
    """
    #Get u_id from token
    u_id = server.get_user_from_token(token)

    #Get list of product ids for user
    user_products = query.user_viewed_products(u_id)

    #Get categories of products and combine into a large list
    all_categories = []

    for p in user_products:
        curr_prod_categories = query.product_categories(p)
        all_categories.extend(curr_prod_categories)

    #Count repeat occurances to have aggregated list
    ranked_categories = list_to_dict(all_categories)

    recommended_products = []

    #For each product in database, we will calculate its "score"
    #Score is given as a total of the categories in its list
    #Each categories points is equal to the corresponding category value
    #in the ranked_categories dict
    #Keep track of highest scoring product and at end of traversal add it to the list
    #Ignore any products already added

    #Open products file
    products = server.read_data(server.PRODUCTS_FILE)

    #Repeats either 10 times or until product list is entirely
    #added to recommended, whichever comes first
    #This could be improved by building the list in one pass (add if better than smallest term?)
    flag = False
    
    while flag == False and len(recommended_products) < 5:
        best_match = {
            "product_id": -1,
            "score": -1
        }
        
        #Iterate through database
        for product in products:
            curr_id = product["product_id"]

            #Check products not already added to recommended
            if curr_id not in recommended_products:
                #calculate score
                curr_score = calculate_product_score(product["categories"], ranked_categories)
                
                #update best match if score is highest so far
                if curr_score > best_match["score"]:
                    best_match["product_id"] = curr_id
                    best_match["score"] = curr_score


        #End of pass through, add best match to recommended list
        if best_match["score"] >= 0:
            recommended_products.append(best_match["product_id"])
        else: #No matches found, so we have no more items in db not in list
            flag = True


    #TODO Create a new list to be returned
    #Should have the product id, name and image of each recommendation
    recommendations = []
    for p_id in recommended_products:
        #p_id is just an id, so we need to grab name + pic
        img_path = f"picture/{p_id}_profile.png"
        try:
            with open(img_path, 'rb') as picture:
                picString = picture.read()
                base_data = base64.b64encode(picString)
                base_message = "data:image/png;base64," + base_data.decode('utf-8')
        except IOError:
            base_message = ""
            print("aaa")

        #get name by using id as index
        prod_name = products[int(p_id) - 1]["name"]

        #dict being added to list
        recommendations.append({
            "id": p_id,
            "name": prod_name,
            "image": base_message
        })


    #List will be in descending order
    return recommendations


def add_viewed_product(u_id, product_id):
    """
    Takes a given product_id and appends it to the data of an account
    as a viewed product.

    Params:
        user_id (int):      unqiue identifier of a user
        product_id (int):   unique identifier of a product

    Returns:
        None
    """
    # Access users account entry
    accounts = server.read_data(server.ACCOUNTS_FILE)
    index = query.account_index(u_id)

    #Check length of products_viewed
    temp_list = accounts[index]["products_viewed"]
    if len(temp_list) > 19: #We need to pop the oldest entry in the list so we only have 20 terms
        del temp_list[0]
        temp_list.append(product_id)
    else: #We have less than 20 terms so we can just add this products
        temp_list.append(product_id)

    accounts[index]["products_viewed"] = temp_list

    server.write_data(server.ACCOUNTS_FILE, accounts)

    return None


def list_to_dict(l):
    """
    Given a list of terms, returns a dict denoting the
    occurances of each term

    Params:
        l (list): list of terms

    Returns:
        d (dict): 
    """
    d = {}

    for term in l:
        if term in d:
            d[term] = d[term] + 1
        else:
            d[term] = 1

    return d

def calculate_product_score(categories, rankings):
    """
    Deterimines the score sum of a list of categories, based off of
    an accompanying dict used to inform point value per category

    Params:
        categories (lst):   strings denoting different categories
        rankings (dict):    string categories as keys and integer scores as values

    Returns:
        score (int): total sum of points for a given list of categories

    """
    score = 0

    for category in categories:
        if category in rankings: #Ensure category exists in rankind dict
            points = rankings[category]
            score = score + points

    return score