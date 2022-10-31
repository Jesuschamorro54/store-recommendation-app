
from .conecction_db import execute_query, connect_db

def search(table, params):
    pass


def insert(table, data):
    
    query = insert_query_build(table, data)

    result = execute_query(query, True)

    return result

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

    print("\nQuery", sql)


    return sql