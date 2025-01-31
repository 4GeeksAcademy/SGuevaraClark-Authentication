from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

api = Blueprint('api', __name__)
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend"
    }
    return jsonify(response_body), 200

@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    id = get_jwt_identity()
    user = User.query.get(id)
    if not user:
        return jsonify({"msg": "something wrong"})
    return jsonify({"user": user.serialize()}), 200

@api.route('/register', methods=['POST'])
def register():
    try:
        email = request.json.get('email', None)
        password = request.json.get('password', None)
        if not email or not password:
            raise Exception('missing data')
            
        check_user = User.query.filter_by(email=email).first()
        if not check_user:
            new_user = User(email=email, password=password, is_active=True)
            db.session.add(new_user)
            db.session.commit()
            access_token = create_access_token(identity=str(new_user.id))
            return {"msg": "Ok!", "token": access_token}, 201
            
        return jsonify({"msg": "Email already registered"}), 400
    except Exception as error:
        return jsonify({'error': str(error)}), 400

@api.route('/login', methods=['POST'])
def login():
    try:
        email = request.json.get('email', None)
        password = request.json.get('password', None)
        if not email or not password:
            raise Exception('missing data')
            
        check_user = User.query.filter_by(email=email).first()
        if check_user.password == password:
            access_token = create_access_token(identity=str(check_user.id))
            return {"msg": "Ok!", "token": access_token}, 201
            
        return jsonify({"msg": "Invalid credentials"}), 400
    except Exception as error:
        return jsonify({'error': str(error)}), 400