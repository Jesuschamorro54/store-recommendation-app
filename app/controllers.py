import json
import functools
from flask import ( escape, render_template, redirect, blueprints, session, request, jsonify, url_for,)
from werkzeug.security import check_password_hash, generate_password_hash

from database.database import insert, search, update

main = blueprints.Blueprint('main', __name__)

@main.context_processor
def general_variables():
    return { 'appName': 'Mega store' }

def login_required(view):
    @functools.wraps(view)
    def wraped_view(**kwargs):
        if 'id' not in session:
            return redirect(url_for('main.login'))
        return view(**kwargs)   
    return wraped_view

@main.context_processor
def login_acc():
    if 'acc' in session:

        user = {
            'userId': session['id'],
            'userSession': True,
            'userRole': session['role'],
        }

        return user
    else:
        return {'userSession':False}


# VIEWS ------------------------------------------------------------------------------------------

@main.route('/', methods=['GET'])
def index():
    return redirect(url_for('main.home'))


@main.route('/home', methods=['GET'])
def home():
    stores = search('stores')

    return render_template('/home/home.html', stores = stores)


@main.route('/associate', methods=['GET'])
def associate():
    return render_template('/owner/associate.html')


@main.route('/products', methods=['GET'])
@login_required
def products():

    stores = []
    products = []

    params = {'owner_id': session['id'], 'fields': ['id', 'name', 'total_sales']}
    stores = search('stores', params)

    if stores:
        params = {
            'state': [0, 1],
            'store_id': [store['id'] for store in stores]
        }
    
        products = search('products', params)

    if products:
        for store in stores:
            store.update({
                'products': [ product for product in products if product['store_id']==store['id'] ]
            })

    # print("STORES: ", stores)

    return render_template('/owner/products.html', stores=stores)


@main.route('/orders', methods=['GET'])
@login_required
def orders():

    result = {'data': []}
    stores = []
    products = []
    purchases = []

    store_purchases = {}

    params = {'owner_id': session['id'], 'fields': ['id', 'name', 'total_sales']}
    stores = search('stores', params);

    if stores:
        params = {
            'state': 0,
            'store_id': [store['id'] for store in stores]
        }

        products = search('products', params)
        purchases = search('purchases', params)

        details_params = {'purchase_id': [purchase['id'] for purchase in purchases]}

        purchase_detail = search('purchases_details', details_params)

        # Escribir la cantidad de pedidos de cada tienda
        for store in stores:
            count = 0
            for purchase in purchases:
                count += 1 if purchase['store_id'] == store['id'] else 0

            store['orders'] = count

        for purchase in purchases:

            data = {
                'Purchase': purchase,
                'Store': {},
                'Detail': [],
            }

            data['Store'] = next( (store for store in stores if purchase['store_id']==store['id']), None )

            for detail in purchase_detail:
                if detail['purchase_id'] == purchase['id']:
                    data['Detail'].append({
                        **detail,
                        'product_name': next( (product['name'] for product in products if product['id']==detail['product_id']), None ),
                        'product_image': next( (product['image'] for product in products if product['id']==detail['product_id']), None )
                    })

            result['data'].append(data)
    
    if result['data']:
        result['status'] = True

    print("RESULT: ", result)

    return render_template('/owner/orders.html', stores=stores, purchases = result['data'], len = len, )



@main.route('/public/<store_id>/products', methods=['GET'])
def public_products(store_id): 

    print("args", request.view_args)

    params = dict(request.view_args)

    products = []

    params = {'store_id': params['store_id']}
    products = search('products', params)

    if products:
        return {'status': True, 'data': products}

    return {'status': False, 'data': []}

# METHODS AUTH ------------------------------------------------------------------------------------------

@main.route('/login/', methods=['GET', 'POST'])
def login():
    
    params = dict(request.form)
    valid = False

    for key, value in params.items():
        valid = bool(value)

    if request.method == 'POST':
        
        email = params['email']
        password = params.pop('password')

        user = search('users', params)[0]
        
        if user:
            
            password = password + email
            vpw = check_password_hash(user['password'] , password)

            if vpw:
                session['id'] = user['id']
                session['name'] = user['nombre']
                session['email'] = user['email']
                session['role'] = user['role'] 
                session['acc'] = True
                
                return redirect(url_for('main.home'))
    return render_template('/auth/login.html')



@main.route('/registrar/', methods=['GET', 'POST'])
def sign_in():
    """
    Función para registrar al usuario
    """
    
    params = dict(request.form)
    valid = False

    for key, value in params.items():
        valid = bool(value)

    if(request.method == 'POST' and valid):

        passcode = params['user_pass'] + params['user_email']
        params['user_pass'] = generate_password_hash(passcode)

        data = {
            'nombre': params['user_name'],
            'email': params['user_email'],
            'password': params['user_pass'],
            'role': 'client',
            'state': 1
        }

        # Database Insert
        result = insert('users', data)

        if result:
            return redirect(url_for('main.login'))
        
    return render_template('/auth/sign_in.html')


# Registrarse como un dueño de una tienda
@main.route('/associate/<user_id>', methods=['POST'])
def own(user_id):

    if request.method == "POST":

        user = {}
        data = {}
        body = {}

        try:

            body = json.loads(request.data)
            user.update({'id': request.view_args['user_id']})

            data = {'owner_id': user['id'], **(body) }

            print("data", data)

        except KeyError as e:
            print("No enviaste suficientes parametros", e)
            return {'status': False, 'error': 'Parametros Insuficientes'}

        params = {'name': data['name']}

        store =  search('stores', params)

        if not store:

            result = insert('stores', data)


            if result:
                
                data['id'] = result

                update('users', user, {'role': 'owner'})

                return {'status': True, 'data': data}
            else:
                return {'status': False, 'data': data, 'error': 'No se pudo crear el elemento'}

    return render_template('/owner/associate.html')


@main.route('/products/<store_id>', methods=['POST'])
@login_required
def addproduct(store_id):

    if request.method == "POST":

        data = {}
        body = {}

        try:

            body = json.loads(request.data)

            data = {
                'store_id': request.view_args['store_id'],
                **(body) 
            }

            print("data", data)

        except KeyError as e:
            print("No enviaste suficientes parametros", e)
            return {'status': False, 'error': 'Parametros Insuficientes'}
        
        
        result = insert('products', data)

        if result:
            data['id'] = result

        else:
            return {'status': False, 'data': data, 'error': 'No se pudo crear el elemento'}


    return {'status': True, 'data': data}


@main.route('/purchases/<store_id>', methods=['POST'])
@login_required
def addpurchases(store_id):

    if request.method == "POST":

        user = {}
        data = {}
        body = {}

        try:

            body = json.loads(request.data)
            user.update({'id': session['id']})

            data = {
                'user_id': user['id'],
                'store_id': request.view_args['store_id'],
                **(body) 
            }

            print("data: ", data)

        except KeyError as e:
            print("No enviaste suficientes parametros", e)
            return {'status': False, 'error': 'Parametros Insuficientes'}
        
        extra_data = data.pop('extra_data', None)

        purchase = insert('purchases', data)

        if purchase:
            print("result: ", purchase)
            print("extra_data: ", extra_data)

            for detail in extra_data['purchases_details']:
                detail['purchase_id'] = int(purchase)

            purchase_details = insert('purchases_details', extra_data['purchases_details']);

            if purchase_details:
                data['id'] = purchase

                return {'status': True, 'data': data}

        else:
            return {'status': False, 'data': data, 'error': 'No se pudo crear el elemento'}


    return {'status': False, 'data': data, 'error': 'Error al ejecutar la funcion'}


@main.route('/purchases/<purchase_id>', methods=['PUT'])
@login_required
def update_purchase(purchase_id):

    if request.method == "PUT":

        data = {}
        params = {}

        try:

            params['id'] = request.view_args.pop('purchase_id')
            data = json.loads(request.data)

        except KeyError as e:
            print("No enviaste suficientes parametros", e)
            return {'status': False, 'error': 'Parametros Insuficientes'}
        
        
        result = update('purchases', params, data)

        if not result:
            return {'status': False, 'data': data, 'error': 'No se pudo crear el elemento'}

        data['id'] = result

    return {'status': True, 'data': data}


@main.route('/stores', methods=['GET'])
def getStores():

    stores = []
    stores = search('stores')

    print(stores)

    if stores:
        return {'status': True, 'data': stores}

    return {'status': False, 'data': [], 'error': "No se encontraron los datos"}


@main.route('/logout')
def logout():
   session.clear()
   return redirect(url_for('main.home'))
