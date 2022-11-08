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

    print("STORES: ", stores)

    return render_template('/owner/products.html', stores=stores)


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


    return redirect(url_for('main.products'))


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
