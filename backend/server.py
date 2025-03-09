"""Flask server for 3900-ibuy project"""
import sys
import os
from json import dumps, dump, load
from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import hashlib
import aihelper

from error import AccessError
import auth
import query
import admin
import cart
import user
import search
import payment
import order
import recommender

def defaultHandler(err): #pylint: disable=invalid-name, missing-function-docstring
    response = err.get_response()
    print('response', err, err.get_response())
    response.data = dumps({
        "code": err.code,
        "name": "System Error",
        "message": err.get_description(),
    })
    response.content_type = 'application/json'
    return response

APP = Flask(__name__)
CORS(APP)

BASE_URL = "http://127.0.0.1"

APP.config['TRAP_HTTP_EXCEPTIONS'] = True
APP.register_error_handler(Exception, defaultHandler)


# AUTHENTICATION

JWT_SECRET = 'ibuy'

def generate_token(u_id, ver):
    """Generate a JWT token with payload u_id and version of token."""

    global JWT_SECRET #pylint: disable=global-statement
    encoded = jwt.encode({'u_id': u_id, 'ver': ver}, JWT_SECRET, algorithm='HS256')
    return encoded#.decode('UTF-8')

def get_user_from_token(token):
    
    """Decode the JWT token and return the payload if the signature is valid."""

    global JWT_SECRET #pylint: disable=global-statement

    # Raises an InvalidSignatureError if the signature verification failed
    try:
        decoded = jwt.decode(token.encode('UTF-8'), JWT_SECRET, algorithms='HS256')
    except (jwt.InvalidSignatureError, jwt.DecodeError):
        raise AccessError(description="invalid token.")

    accounts = read_data(ACCOUNTS_FILE)

    index = query.account_index(decoded['u_id'])

    if index is not None and accounts[index]['jwt_ver'] == decoded['ver']:
        return decoded['u_id']

    raise AccessError(description="invalid token.")



# DATABASE
server_dir = os.path.dirname(__file__) #pylint: disable=invalid-name
ACCOUNTS_FILE = os.path.join(server_dir, 'data/accounts.json')
U_ID_FILE = os.path.join(server_dir, 'data/newestid.json')
CART_FILE = os.path.join(server_dir, 'data/cart.json')
GIFTCODE_FILE = os.path.join(server_dir, 'data/giftcode.json')
PRODUCTS_FILE = os.path.join(server_dir, 'data/product.json')
USER_ORDER_FILE = os.path.join(server_dir, 'data/userorder.json')
PRODUCT_ORDER_FILE = os.path.join(server_dir, 'data/productorder.json')
ADMIN_RECOMMEND_FILE = os.path.join(server_dir, 'data/admin_recommend_product.json')
HELPER_FILE = os.path.join(server_dir, 'data/helper.json')

def write_data(path, data): #pylint: disable=missing-function-docstring
    with open(path, 'w') as file_out:
        dump(data, file_out)

def read_data(path): #pylint: disable=missing-function-docstring
    with open(path, 'r') as file_in:
        return load(file_in)

@APP.route('/items', methods=['POST', 'PUT'])

def product_add():

    params = request.get_json()

    response = admin.admin_add_product(params)

    return jsonify(response)


@APP.route('/items/<id>',methods=['POST', 'PUT'])
def product_view(id):
    if(request.method == 'POST'):

        params = request.args
        return admin.admin_view_product(
            int(id),
            params.get("token")
        )

    elif(request.method == 'PUT'):
        print('updating product')
        params = request.get_json()

        response = admin.admin_edit_product(params,int(id))
        return jsonify(response)

@APP.route('/admin/login', methods=['POST'])
def admin_login():
    params = request.get_json()
    response = auth.login(
        params['email'],
        params['hashedPassword']
    )
    return jsonify(response)


# AUTH ROUTES
@APP.route('/auth/register', methods=['POST'])
def auth_register():
    params = request.get_json()

    response = auth.register(
        params['email'],
        params['firstName'],
        params['lastName'],
        params['password'],
        params['referralCode']
    )
    return jsonify(response)

@APP.route('/auth/login', methods=['POST'])
def auth_login():
    params = request.get_json()
    response = auth.login(
        params['email'],
        params['password']
    )

    return jsonify(response)

@APP.route('/auth/logout', methods=['POST'])
def auth_logout():
    params = request.get_json()
    response = auth.logout(
        params['token']
    )
    return jsonify(response)

@APP.route('/auth/passwordreset/request', methods=['POST'])
def auth_password_request():
    params = request.get_json()
    response = auth.reset_request(
        params['email']
    )
    return jsonify(response)

@APP.route('/auth/passwordreset/reset', methods=['POST'])
def auth_password_reset():
    params = request.get_json()
    response = auth.password_reset(
        params['resetCode'],
        params['password']
    )
    return jsonify(response)

# USER ROUTES
@APP.route('/user/details', methods=['GET'])
def user_details():
    params = request.args
    response = user.user_profile(
        params['token']
    )
    return jsonify(response)

@APP.route('/user/details/setemail', methods=['PUT'])
def user_set_email():
    params = request.get_json()
    response = user.user_profile_set_email(
        params['token'],
        params['email']
    )
    return jsonify(response)

@APP.route('/user/details/setname', methods=['PUT'])
def user_set_name():
    params = request.get_json()
    response = user.user_profile_set_name(
        params['token'],
        params['firstName'],
        params['lastName']
    )
    return jsonify(response)

@APP.route('/user/details/setpassword', methods=['PUT'])
def user_set_pwd():
    params = request.get_json()
    response = user.user_profile_set_password(
        params['token'],
        params['currentPassword'],
        params['newPassword']
    )
    return jsonify(response)

@APP.route('/user/paymentmethods', methods = ['POST', 'DELETE', 'GET'])
def user_payment_methods():
    response = {}
#token, card_number, cvc, expiry_date, name
    if request.method == 'POST':
        params = request.get_json()
        response = payment.add_credit_card(
            params['token'],
            params['cardNumber'],
            params['cvc'],
            params['expiryDate'],
            params['name']
        )
    elif request.method == 'DELETE':
        params = request.get_json()
        response = payment.delete_credit_card(
            params['token'],
            params['id']
        )
    elif request.method == 'GET':
        params = request.args
        response = payment.get_credit_cards(
            params['token']
        )

    return jsonify(response)

@APP.route('/user/wallet', methods = ['GET'])
def get_wallet():
    params = request.args

    response = user.get_wallet_balance(
        params['token']
    )

    return jsonify(response)

@APP.route('/user/addresses', methods = ['POST', 'DELETE', 'GET', 'PUT'])
def user_addresses_methods():
    response = {}
#token, card_number, cvc, expiry_date, name
    if request.method == 'POST':
        params = request.get_json()
        response = payment.add_address(
            params['token'],
            params['fullName'],
            params['phoneNumber'],
            params['address'],
            params['postCode'],
            params['country'],
            params['state'],
            params['suburb'],
            params['postalDefault'],
            params['billingDefault']
        )
    elif request.method == 'DELETE':
        params = request.get_json()
        response = payment.delete_address(
            params['token'],
            params['id']
        )
    elif request.method == 'PUT':
        params = request.get_json()
        response = payment.modify_address(
            params['token'],
            params['id'],
            params['fullName'],
            params['phoneNumber'],
            params['address'],
            params['postCode'],
            params['country'],
            params['state'],
            params['suburb'],
            params['postalDefault'],
            params['billingDefault']
        )
    elif request.method == 'GET':
        params = request.args
        response = payment.get_addresses(
            params['token']
        )
        

    return jsonify(response)

# DATABASE RESET ROUTE
@APP.route('/workspace/reset', methods=['POST'])
def reset_data():
    """
    Resets the workspace state after demoing

    newestid -> 0
    accounts -> admin kept
    admin_recommend -> cleared
    cart -> cleared
    giftcode -> cleared
    product -> histories wiped
    productorder -> wiped
    userorder -> wiped
    """

    write_data(U_ID_FILE, {'newest_u_id': 0})

    write_data(ACCOUNTS_FILE, [{
        "u_id": 0,
        "email": "admin@ibuy.com",
        "first_name": "Admin",
        "last_name": "Admin",
        "pass_hash": hashlib.sha256("password".encode()).hexdigest(),
        "jwt_ver": 0,
        "is_admin": 1,
        "reset_code": "",
        "wallet_balance": 0,
        "personal_referral_code":-1,
        "friend_referral_code": 0,
        "newest_cc": 0,
        "credit_cards": [],
        "newest_address": 0,
        "addresses": [],
        "products_viewed": []
    }])

    write_data(ADMIN_RECOMMEND_FILE, [{"product_id": 2}])

    write_data(CART_FILE, [])

    write_data(GIFTCODE_FILE, [])

    write_data(PRODUCTS_FILE, [
        {
            "product_id": "1", 
            "name": "Logitech G810", 
            "description": "Gaming Mechanical Keyboard ", 
            "price": "45", 
            "stock": "20", 
            "categories": ["Keyboard"], 
            "image": "picture/1_profile.png", 
            "status": 1, 
            "history": [{"price": 45, "quantity": 0}]
        }, {
            "product_id": "2", 
            "name": "Logitech G305", 
            "description": "Gaming Mouse", 
            "price": "35", 
            "stock": "30", 
            "categories": ["Mouse"], 
            "image": "picture/2_profile.png", 
            "status": 1, 
            "history": [{"price": 35, "quantity": 0}]
        }, {
            "product_id": "3", 
            "name": "Logitech G502", 
            "description": "Gaming Mechanical Mouse - High Performance", 
            "price": "129", 
            "stock": "15",
            "categories": ["Mouse"],
            "image": "picture/3_profile.png",
            "status": 1,
            "history": [{"price": 129, "quantity": 0}]
        }, {
            "product_id": "4", 
            "name": "Minecraft Guidebook", 
            "description": "A greate book for all players!", 
            "price": "15", 
            "stock": "9",
            "categories": ["Book"],
            "image": "picture/4_profile.png",
            "status": 1,
            "history": [{"price": 15, "quantity": 0}]
        }, {
            "product_id": "5", 
            "name": "WiFi for Dummies", 
            "description": "Tech support for the modern man", 
            "price": "30", 
            "stock": "15",
            "categories": ["Book"],
            "image": "picture/5_profile.png",
            "status": 1,
            "history": [{"price": 30, "quantity": 0}]
        }, {
            "product_id": "6", 
            "name": "Guinness World Records: Video Game Edition", 
            "description": "You have to see it to believe it", 
            "price": "30", 
            "stock": "15",
            "categories": ["Book"],
            "image": "picture/6_profile.png",
            "status": 1,
            "history": [{"price": 30, "quantity": 0}]
        }, {
            "product_id": "7", 
            "name": "The Python Book", 
            "description": "Get out there and get coding!", 
            "price": "30", 
            "stock": "15",
            "categories": ["Book"],
            "image": "picture/7_profile.png",
            "status": 1,
            "history": [{"price": 30, "quantity": 0}]
        }, {
            "product_id": "8", 
            "name": "Web Security for Dummies", 
            "description": "Maybe you should have bought this too...", 
            "price": "30", 
            "stock": "15",
            "categories": ["Book"],
            "image": "picture/8_profile.png",
            "status": 1,
            "history": [{"price": 30, "quantity": 0}]
        }
    ])


    write_data(PRODUCT_ORDER_FILE, [])

    write_data(USER_ORDER_FILE, [])

    write_data(HELPER_FILE, [])

    

    return {}

@APP.route('/cart', methods = ['GET','POST', 'PUT', 'DELETE'])

def cart_add_edit():
    if request.method == 'POST' or request.method == 'PUT':
        parameters = request.get_json()
        print(parameters)
    elif request.method == 'GET' or request.method == 'DELETE':
        parameters = request.args

    if request.method == 'POST':
        response = cart.add_product(parameters)
    elif request.method == 'PUT':
        response = cart.edit_product(parameters)
    elif request.method == 'GET':
        response = cart.show_product(parameters)
    elif request.method == 'DELETE':
        response = cart.delete_product(parameters)

    print(response)
    return jsonify(response)

# @APP.route('/cart/<token>', methods = ['GET', 'DELETE'])
# def cart_get_delete():
#     if request.method != 'GET':
#         parameters = request.get_json()
#     if request.method == 'GET':
#         response = cart.show_product(token)
#     else:
#         response = cart.delete_product(parameters)
#     return jsonify(response)


@APP.route('/user/buycode', methods = ['POST'])
def user_buy_code():
    params = request.get_json()
    response = user.create_gift_code(
        params['value'],
        params['email']
    )
    return jsonify(response)

@APP.route('/user/redeemcode', methods = ['POST'])
def user_redeem_code():
    params = request.get_json()
    response = user.redeem_gift_code(
        params['token'],
        params['giftCode']
    )
    return jsonify(response)


@APP.route('/items/search', methods = ['POST'])
def do_search():
    parameters = request.get_json()
    response = search.basic_search(parameters)
    return jsonify(response)

@APP.route('/recommender', methods = ['GET'])
def recommended():
    params = request.args
    response = recommender.construct_recommended_list(
        params['token']
    )
    return jsonify(response)

@APP.route('/orders', methods = ['POST', 'GET'])
def get_orders():
    if request.method == 'GET':
        params = request.args
        response = order.get_order(params)
        return jsonify(response)
    else:
        params = request.get_json()
        response = order.complete_order(params)
        return jsonify(response)




@APP.route('/admin/recommend/<id>', methods = ['POST','DELETE'])
def admin_recommend_product(id):
    if request.method == 'POST':
        response = admin.admin_recommend_product(int(id))
    else:
        response = admin.admin_delete_recommend_product(int(id))
    return jsonify(response)



@APP.route('/admin/sales', methods = ['GET'])
def get_product_order():
    response = admin.admin_view_sales()
    return jsonify(response)

@APP.route('/admin/recommend/display', methods = ['GET'])
def get_admin_recommend():
    response = admin.get_admin_recommend_product()
    return jsonify(response)

@APP.route('/helper/price', methods = ['POST'])
def price_ques():
    params = request.get_json()
    response = aihelper.price_question(
        params["token"],
        params["maxPrice"],
        params["minPrice"]
    )
    return jsonify(response)

@APP.route('/helper/stock', methods = ['POST'])
def stock_ques():
    params = request.get_json()
    response = aihelper.stock_question(
        params["token"],
        params["stock"]
    )
    return jsonify(response)

@APP.route('/helper/categories', methods = ['POST', 'GET'])
def categories_ques():
    if request.method == 'POST':
        params = request.get_json()
        response = aihelper.category_question(
            params["token"],
            params["specificity"],
            params["categoryChoice"]
        )
        return jsonify(response)
    elif request.method == 'GET': # Nathan, use this to know what categories to give as options
        params = request.args
        response = aihelper.get_categories(
            params.get("token")
        )
        return jsonify(list(response))


@APP.route('/helper/final', methods = ['GET'])
def final_ans():
    params = request.args
    response = aihelper.helper_suggestion(
        params.get("token")
    )
    return jsonify(response)


if __name__ == "__main__":
    APP.run(port=(int(sys.argv[1]) if len(sys.argv) == 2 else 8181))
