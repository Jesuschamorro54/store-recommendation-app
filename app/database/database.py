
from .conecction_db import execute_query, connect_db

def evaluate_contidions(params):
    
    condition = ""
    
    if params:

        condition = "WHERE "
        count = 0
        for field, value in params.items():
            
            if count > 0:
                condition += "AND"

            try:
                value = int(value)
            except:
                pass
            
            condition += f"{field} like '{value}'" if type(value) is str else f"{field} = {value}"
            count += 1
    
    return condition


def select_query_build(table, params = None):
    
    str_fields = "*"
    if params:
        fields = params.pop('fields') if 'fields' in params else '*'
        str_fields = str(fields).replace("'", "`")

    condition = evaluate_contidions(params)
        
    
    sql = f"SELECT {str_fields} FROM {table} {condition}"

    return sql



def insert_query_build(table, data):

    fields = tuple([field for field in data]) if type(data) is dict else tuple([field for field in data[0]])
    str_fields = str(fields).replace("'", "`")
    values = []
    str_values = ""

    if type(data) is list:
        for item in data:
            values.append(tuple(item.values()))
    else:
        values = [tuple(data.values())]

    for i in range(len(values)):
        str_values +=  str(values[i])
        str_values += "," if i < len(values)-1 else ""
    

    sql = f"INSERT INTO {table} {str_fields} VALUES {str_values};"

    return sql



def update_query_build(table, params, data):

    set_data = ""
    count = 1
    for key, value in data.items():

        set_data += f"{key} = '{value}'"
        set_data += ", " if count < len(data.keys()) else " "

    condition = evaluate_contidions(params)

    sql = f"UPDATE {table} SET {set_data} {condition};"

    return sql



def search(table, params = None):

    query = select_query_build(table, params)

    result = execute_query(query)

    return result



def insert(table, data):
    
    query = insert_query_build(table, data)

    result = execute_query(query, True)

    return result



def update(table, params, data):

    query = update_query_build(table, params, data)

    result = execute_query(query, True)

    return result