import server,error

def complete_order(params):
    """
    complete a order, add them to the order history
    if the consumer has a friend referral code, add certain amount
    to the friend's account

    Params:
        a dictionary contains the following keys:
            token(string): the token of the user

    Returns:
        a message(string) shows whether the order is complete, or the product
        is out of stock
    """
    users = server.read_data(server.ACCOUNTS_FILE)
    user_orders = server.read_data(server.USER_ORDER_FILE)
    product_orders = server.read_data(server.PRODUCT_ORDER_FILE)
    cart = server.read_data(server.CART_FILE)
    products = server.read_data(server.PRODUCTS_FILE)
    try:
        u_id = server.get_user_from_token(params["token"])
    except error.AccessError:
        return "something wrong when show product"
    index = -1
    for id, account in enumerate(cart):
        if int(account['u_id']) == u_id:
            index = id
    if index == -1:
        return None
    else:
        cart_contents = cart[index]['content']
    amount = 0
    product_order_history = []
    user_order_history = []
    for cart_product_content in cart_contents:
        for product in products:
            if int(product['product_id']) == cart_product_content['productId']:
                if int(product["stock"]) < cart_product_content["quantity"]:
                    return "no enough stock"
                else:
                    product["stock"] = str(int(product["stock"]) - cart_product_content["quantity"])
    for cart_product_content in cart_contents:
        for product in products:
            if int(product['product_id']) == cart_product_content['productId']:
                amount = amount + cart_product_content['quantity'] * int(product['price'])
                #product_history = {}
                #flag = 0
                for history in product['history']:
                    if history['price'] == int(product['price']):
                        history['quantity'] += cart_product_content['quantity']
                        #flag = 1
                #if flag == 0:
                #    product_history["price"] = int(product['price'])
                #    product_history["quantity"] = cart_product_content['quantity']
                #    product['history'].append(product_history)
                history = {}
                history["itemId"] = product['product_id']
                history["name"] = product['name']
                history["quantity"] = cart_product_content['quantity']
                user_order_history.append(history)
    cart[index]['content'] = []
    referral_code = -1
    for user in users:
        if user['u_id'] == u_id:
            referral_code = user["friend_referral_code"]
            if user['wallet_balance'] >= amount:
                user['wallet_balance'] -= amount
            else:
                user['wallet_balance'] = 0
    if referral_code != -1:
        for user in users:
            if user["personal_referral_code"] == referral_code:
                user["wallet_balance"] += amount * 0.01
    flag = 0
    for user_order in user_orders:
        if user_order['u_id'] == u_id:
            user_order['orders'] += user_order_history
            flag = 1
            break
    if flag == 0:
        new_user_history = {}
        new_user_history['u_id'] = u_id
        new_user_history['orders'] = user_order_history
        user_orders.append(new_user_history)
    server.write_data(server.ACCOUNTS_FILE, users)
    server.write_data(server.PRODUCTS_FILE, products)
    server.write_data(server.USER_ORDER_FILE, user_orders)
    server.write_data(server.CART_FILE, cart)
    return 'Order successfully placed.'


def get_order(params):
    """
    get the order history of the user

    Params:
        params: dictionary that has key:
            token(string): token of the user

    Returns:
        a dictionary that contains all the order history of a user

    """
    user_order = server.read_data(server.USER_ORDER_FILE)
    try:
        u_id = server.get_user_from_token(params.get('token'))
    except error.AccessError:
        return "something wrong when show product"
    for user in user_order:
        if user['u_id'] == u_id:
            order_history = []
            for order in user['orders']:
                temp_order = {}
                temp_order["itemId"] = order["itemId"]
                temp_order["name"] = order["name"]
                temp_order["status"] = "complete"
                order_history.append(temp_order)
            return order_history
    return "Can't find user"

