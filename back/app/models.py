from datetime import datetime
from app import db
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
from app import app, auth
from flask import g



class AAA(db.Model):
    __tablename__ = 'aaas'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), index=True)

    def get_name(self):
        return self.name

    def get_id(self):
        return self.id


class Film(db.Model):
    __tablename__ = 'films'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(32), index=True)
    url_picture = db.Column(db.String(100), index=True)
    url_trailer = db.Column(db.String(100), index=True)
    description = db.Column(db.String(1000), index=True)

    def get_id(self):
        return self.id
    def get_title(self):
        return self.title
    def get_url_picture(self):
        return self.url_picture
    def get_url_trailer(self):
        return self.url_trailer
    def get_description(self):
        return self.description


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), index=True)
    password_hash = db.Column(db.String(64))

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def generate_auth_token(self, expiration=600):
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None    # valid token, but expired
        except BadSignature:
            return None    # invalid token
        user = User.query.get(data['id'])
        return user




@auth.verify_password
def verify_password(username_or_token, password):
    # first try to authenticate by token
    user = User.verify_auth_token(username_or_token)
    if not user:
        # try to authenticate with username/password
        user = User.query.filter_by(username=username_or_token).first()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True


