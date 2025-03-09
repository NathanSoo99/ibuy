import server
import recommender
import error
import random
import base64

ACTIVE = 1
INACTIVE = 0

def admin_edit_product(product,id):
    """
    function for admin to edit a product specified by an id

    Params:

    product(dict): contains product information
    id(int): the id of the product

    Returns:
        a message(string) that shows that the product is successfully edited

    """
    products = server.read_data(server.PRODUCTS_FILE)
    product_to_be_edited = products[id-1]
    print(product_to_be_edited)
    product_to_be_edited["name"] = product["name"]
    product_to_be_edited["description"] = product["description"]
    if product_to_be_edited["price"] != product["price"]:
        temp = {}
        temp["price"] = int(product["price"])
        temp["quantity"] = 0
        product_to_be_edited["history"].append(temp)
    product_to_be_edited["price"] = product["price"]
    product_to_be_edited["stock"] = product["stock"]
    product_to_be_edited["categories"] = product["categories"]
    picture_path = "picture/%s_profile.png" % product["product_id"]
    with open(picture_path,'wb') as picture:
        base_data_two = product["image"].encode('utf-8')
        decodeString = base_data_two[22:]
        padding = len(decodeString) % 4
        decodeString = decodeString +(4-padding) * b"="
        decoded = base64.decodebytes(decodeString)
        picture.write(decoded)
    server.write_data(server.PRODUCTS_FILE,products)
    return "successfully edit product"

def admin_add_product(product):
    """
    function for an admin to add a product to the product database

    Returns:
        a message(string) that shows that the product is successfully added

    """
    products = server.read_data(server.PRODUCTS_FILE)
    product_id = str(len(products)+1)
    picture_path = "picture/%s_profile.png" % product_id
    category_list = product["categories"].split(" ")


    products.append({
        "product_id": product_id,
        "name": product["name"],
        "description": product["description"],
        "price": product["price"],
        "stock": product["stock"],
        "categories": category_list,
        "image": picture_path,
        "history": [{"price": int(product["price"]), "quantity":0}],
        "status": ACTIVE
    })
    picture_path = "picture/%s_profile.png" % product_id
    with open(picture_path,'wb') as picture:
        base_data_two = product["image"].encode('utf-8')
        decodeString = base_data_two[22:]
        padding = len(decodeString) % 4
        decodeString = decodeString +(4-padding) * b"="
        decoded = base64.decodebytes(decodeString)
        picture.write(decoded)
    server.write_data(server.PRODUCTS_FILE,products)
    return "successfully add product"


def admin_view_product(id,token):
    """
    function for getting all the information for a product indicated by the product id

    Params:
        id(int) : the product id

    Returns:
        a dictionary containing all the product information

    """

    products = server.read_data(server.PRODUCTS_FILE)
    product_view = products[id-1]
    picture_path = "picture/%s_profile.png" % str(id)
    if int(product_view["status"]) == INACTIVE:
        return {}
    try:
        with open(picture_path, 'rb') as picture:
            picString = picture.read()
            base_data = base64.b64encode(picString)
            base_message = "data:image/png;base64," + base_data.decode('utf-8')
    except IOError:
        base_message = ""
        print("aaa")

    #Add product to view history (if client is logged in)
    if token != "null":
        u_id = server.get_user_from_token(token)
        recommender.add_viewed_product(u_id, product_view["product_id"])


    return {
        "product_id": product_view["product_id"],
        "name": product_view["name"],
        "description": product_view["description"],
        "price": product_view["price"],
        "stock": product_view["stock"],
        "categories": product_view["categories"],
        "image": base_message
    }

def admin_view_sales():
    """
    a function for the admin to view all the sales data in the database

    Returns:
        a dictionary that contains all the sales data in the database, if the
        product's price has been changed, the sales data is displayed separately

    """
    products = server.read_data(server.PRODUCTS_FILE)
    response = []
    for product in products:
        product_sale = {}
        product_sale["name"] = product["name"]
        product_sale["history"] = []
        for sales in product["history"]:
            sales_data = {}
            sales_data["price"] = sales["price"]
            sales_data["quantity"] = sales["quantity"]
            product_sale["history"].append(sales_data)
        response.append(product_sale)
    return response

def view_product_sales(id):
    """
    a function used to view a product's sales data specified by the product id

    Params:
        id(int) : the id of the product

    Returns:
        a dictionary that contains all the sales data for the product in the database, if the
        product's price has been changed, the sales data is displayed separately

    """
    products = server.read_data(server.PRODUCTS_FILE)
    response = []
    product = products[id-1]
    product_sale = {}
    product_sale["name"] = product["name"]
    product_sale["history"] = []
    for sales in product["history"]:
        sales_data = {}
        sales_data["price"] = sales["price"]
        sales_data["quantity"] = sales["quantity"]
        product_sale["history"].append(sales_data)
    response.append(product_sale)
    return response

def admin_recommend_product(id):
    """
    a function for the admin to recommend a certain product specified by product id

    Params:
        id(int): the id of the product

    Returns:
        a message(string) that shows that the product is successfully added or not

    """
    recommends = server.read_data(server.ADMIN_RECOMMEND_FILE)
    for recommend in recommends:
        if recommend['product_id'] == id:
            return "already recommended"
    new_recommend = {}
    new_recommend["product_id"] = id
    recommends.append(new_recommend)
    server.write_data(server.ADMIN_RECOMMEND_FILE,recommends)
    return "successfully add recommended product"

def admin_delete_recommend_product(id):
    """
    delete a product specified by the product id from the
    recommend list of the admin

    Params:
        id(int): the id of the product

    Returns:
        a message(string) that shows that the product is successfully deleted

    """
    recommends = server.read_data(server.ADMIN_RECOMMEND_FILE)
    for recommend in recommends:
        if recommend["product_id"] == id:
            recommends.remove(recommend)
    server.write_data(server.ADMIN_RECOMMEND_FILE,recommends)
    return "successfully delete recommended product"

def get_admin_recommend_product():
    """
    get the image and price of the products recommended by the admin

    Returns:
        a dictionary that contains all the recommended product id, price and image data
    """
    products = server.read_data(server.PRODUCTS_FILE)
    recommends = server.read_data(server.ADMIN_RECOMMEND_FILE)
    response = []
    for recommend in recommends:
        product_detail = {}
        product_view = products[recommend['product_id']-1]
        picture_path = "picture/%s_profile.png" % str(recommend['product_id'])
        if int(product_view["status"]) == INACTIVE:
            return {}
        try:
            with open(picture_path, 'rb') as picture:
                picString = picture.read()
                base_data = base64.b64encode(picString)
                base_message = "data:image/png;base64," + base_data.decode('utf-8')
        except IOError:
            base_message = ""
            print("aaa")
        product_detail["product_id"] = str(recommend['product_id'])
        product_detail["price"] = products[recommend['product_id']-1]['price']
        product_detail["image"] = base_message
        response.append(product_detail)
    return response