import server
from error import *

def add_product(params):
    """
    add a product by certain amount into a user's shopping cart

    Returns:
        a message(string) indicates whether the deletion is successful or not
    """
    cart = server.read_data(server.CART_FILE)
    try:
        u_id = server.get_user_from_token(params['token'])
    except AccessError:
        return "something wrong when add product"
    index = -1
    for id, account in enumerate(cart):
        if account['u_id'] == u_id:
            index = id
    if index == -1:

        content = []
        content.append({
            "productId": int(params["itemId"]),
            "quantity": int(params["quantity"])
        })
        new_cart = {}
        new_cart["u_id"] = u_id
        new_cart["content"] = content
        cart.append(new_cart)
    else:
        flag = 0
        for item in cart[index]['content']:
            if item['productId'] == int(params["itemId"]):
                item['quantity'] += int(params["quantity"])
                flag = 1
                break
        if flag == 0:
            cart[index]['content'].append({
                "productId": int(params["itemId"]),
                "quantity": int(params["quantity"])
            })
    server.write_data(server.CART_FILE, cart)

    return "successfully add product"



def edit_product(params):
    """
    edit the quantity of a item in the user's shopping cart

    Returns:
        a message(string) indicates whether the deletion is successful or not

    """
    cart = server.read_data(server.CART_FILE)
    try:
        u_id = server.get_user_from_token(params['token'])
    except AccessError:
        return "something wrong when edit product"
    index = -1
    for id, account in enumerate(cart):
        if int(account['u_id']) == u_id:
            index = id
    if index == -1:
        return None
    else:
        length = len(cart[index]['content'])
        i = 0
        while(i < length):
            if(cart[index]['content'][i]["productId"] == int(params["itemId"])):
                cart[index]['content'][i]['quantity'] = int(params["quantity"])
                break
            else:
                i = i + 1
    server.write_data(server.CART_FILE, cart)

    return "successfully edit product"


def show_product(params):
    """
    show a user's entire shopping cart content

    Returns:
        the content of the shopping cart

    """
    cart = server.read_data(server.CART_FILE)
    try:
        u_id = server.get_user_from_token(params.get('token'))
    except AccessError:
        return "something wrong when show product"
    index = -1
    for id, account in enumerate(cart):
        if int(account['u_id']) == u_id:
            index = id
    if index == -1:
        return None
    else:
        return cart[index]['content']


def delete_product(params):
    """
    delete a product from a user's shopping cart

    Returns:
        a message(string) indicates whether the deletion is successful or not

    """
    cart = server.read_data(server.CART_FILE)
    try:
        u_id = server.get_user_from_token(params.get('token'))
    except AccessError:
        return "something wrong when delete product"
    index = -1
    for id, account in enumerate(cart):
        if account['u_id'] == u_id:
            index = id
    if index == -1:
        return None
    else:
        length = len(cart[index]['content'])
        i = 0
        while(i < length):
            if(cart[index]['content'][i]['productId'] == int(params.get("productId"))):
                del cart[index]['content'][i]
                break
            else:
                i = i + 1
    server.write_data(server.CART_FILE, cart)

    return "successfully delete product"