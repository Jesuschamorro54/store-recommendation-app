from flask import ( escape, render_template, redirect, blueprints, session, request, jsonify, url_for,)
from werkzeug.security import check_password_hash, generate_password_hash

from database import database as db

main = blueprints.Blueprint('main', __name__)

@main.context_processor
def general_variables():
    return { 'appName': 'App Name' }

@main.context_processor
def login_acc():
    if 'acc' in session:
        return {'userSession': True}
    else:
        return {'userSession':False}


# VIEWS ------------------------------------------------------------------------------------------

@main.route('/')
def index():
    return render_template('/home/home.html')

@main.route('/home')
def home():
    return render_template('/home/home.html')


# @main.route('/registrar')
# def sign_in_view():
#     return render_template('/auth/sign_in.html')

@main.route('/login')
def login_view():
    return render_template('/auth/login.html')



# METHODS ------------------------------------------------------------------------------------------

@main.route('/login/', methods=['GET', 'POST'])
def login():
    
    if request.method == 'POST':
        usr_email = escape(request.form['usr_email'])
        usr_password = escape(request.form['usr_password'])
        info_user = db.search(usr_email)
        if info_user is not None:
            usr_password = usr_password + usr_email
            vpw = check_password_hash(info_user[3], usr_password)
            if(vpw):
                session['id'] = info_user[0]
                session['usr_name'] = info_user[1]
                session['usr_email'] = info_user[2]
                session['usr_rol'] = info_user[4]
                session['acc'] = True
                return redirect(url_for('main.dashboard'))            
        return render_template('usr_login.html')
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
            'rol': 'client',
            'state': 1
        }

        # Database Insert
        result = db.insert('users', data)

        if result:
            return redirect(url_for('main.login'))
        
    return render_template('/auth/sign_in.html')