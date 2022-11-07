import pymysql

BL = '\033[30m'  # Black
R = '\033[31m'  # Red
G = '\033[32m'  # Green
Y = '\033[33m'  # Yellow
B = '\033[34m'  # Blue
M = '\033[35m'  # Magenta
C = '\033[36m'  # Cian
W = '\033[37m'  # White
RS = '\033[39m'  # Reset

def connect_db():
    """
    Conectarse a la base de datos   
    """
    connection = {}

    try:
        connection = pymysql.connect(host="localhost", user="root", passwd="20023006", db="store_app", cursorclass=pymysql.cursors.DictCursor,)
        print(f"{G} * Connection to MySQL instance established{RS}")
    except Exception as e:
        print(f"{R} * Could not connect to MySQL instance: {RS}", e)
    
    return connection


def execute_query (query, write = False):
    
    data = {}
    
    conn = connect_db()

    print("Query: ", query)
    
    try:
        with conn.cursor() as cursor:
            cursor.execute(query)
            data = cursor.lastrowid if write else cursor.fetchall()

            if "UPDATE" in query and data:
                data = True
            
            if write:
                conn.commit()

            print(f'{G} * Successful query execution{RS}')
    except Exception as e:
        print(f'{R} * ERROR: Could not execute SQL query.\n{RS} {e}')
        data = {}
        
    return data