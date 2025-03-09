import server


def basic_search(parameters):
    """
    do a basic search that check whether there are matched products that their
    names or description strings contain certain string

    Returns:
        a list of products that match the string

    """
    search_string = parameters['term'].lower()
    products = server.read_data(server.PRODUCTS_FILE)
    name_match = []
    description_match = []
    length = len(products)
    for i in range(0,length):
        if search_string in products[i]['name'].lower():
            name_match.append({
                "name": products[i]['name'],
                "price": products[i]['price'],
                "id": products[i]['product_id']
            } )
        elif search_string in products[i]['description'].lower():
            description_match.append({
                "name": products[i]['name'],
                "price": products[i]['price'],
                "id": products[i]['product_id']
            } )
        elif any(search_string in category.lower() for category in products[i]['categories']):
            description_match.append({
                "name": products[i]['name'],
                "price": products[i]['price'],
                "id": products[i]['product_id']
            } )
    result = []
    result = result + name_match + description_match
    return result
