import os
from flask import Flask

app = Flask(__name__)
app.config.from_object(__name__)
app.config["DEBUG"] = True
app.secret_key = os.urandom( 50 )

from controllers import main

app.register_blueprint(main)

if __name__ == '__main__':
    app.run(debug=True)