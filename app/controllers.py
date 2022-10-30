from flask import (
    render_template, redirect, 
    blueprints, 
    session, request, jsonify,
)

main = blueprints.Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('/home/home.html')

@main.route('/home')
def home():
    return render_template('/home/home.html')

@main.context_processor
def login_acc():
    if 'acc' in session:
        return {'userSession': True}
    else:
        return {'userSession':False}