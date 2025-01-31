"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


#Acceso usuarios registrados ----------------------------

@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    id = get_jwt_identity()
    user = User.query.get(id)
    if not user:
        return jsonify({"msg": "something wrong"})
    return jsonify({"user": user.serialize()}), 200

 
#Registro de Usuario ----------------------------

@api.route('/register', methods=['POST'])
def register():
    try:
        #extraemos info
        email = request.json.get('email', None) #le decimos al final que si no hay email, nos devuelva none
        password = request.json.get('password', None)
        #checkeamos toda la info este
        if not email or not password:
            raise Exception ('missing data') #si no tengo email o password me devuelve esto
        #checkeamos que el usuario existe
        check_user = User.query.filter_by(email=email).first() #.first() quiere decir que cuando encuentre el primero que pare
        #si no existe lo creamos
        if not check_user:
            new_user = User(email=email, password=password, is_active=True) #crear un nuevo usuario
            db.session.add(new_user) #añade a la tabla de la db
            db.session.commit() #guarda los cambios en la db
            access_token = create_access_token(identity=str(new_user.id)) #estamos creando un token cuya identidad va a ser el id del usuario de arriba
        
            return ({"msg": "Ok!", "token": access_token}), 201
        #si el usuario existe devolvemos que ya hay una cuenta con ese correo
        return jsonify({"msg": "Usuario vinculado a este correo, intenta iniciar sesión"}), 400

    except Exception as error:
        return jsonify({'error': str(error)}), 400

#Login ----------------------------

@api.route('/login', methods=['POST'])
def login():
    try:
        #extraemos info
        email = request.json.get('email', None)
        password = request.json.get('password', None)
        #checkeamos toda la info este
        if not email or not password:
            raise Exception ('missing data')
        #checkeamos que el usuario existe -----
        check_user = User.query.filter_by(email=email).first() #.first() quiere decir que cuando encuentre el primero que pare
        #si existe, si el password que estoy recibiendo es igual que el almacenado
        if check_user.password == password:
            access_token = create_access_token(identity=str(check_user.id)) #si eso pasa creo mi asscess token y lo envío
            return ({"msg": "Ok!", "token": access_token}), 201
        return jsonify({"msg": "Usuario vinculado a este correo, intenta iniciar sesión"}), 400

    except Exception as error:
        return jsonify({'error': str(error)}), 400