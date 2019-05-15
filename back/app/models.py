from datetime import datetime
from app import db
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
from app import app, auth
from flask import g




class Session(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    title_film = db.Column(db.String(32), index=True)
    title_cinema = db.Column(db.String(50), index=True)
    location = db.Column(db.String(50), index=True)
    date = db.Column(db.String(32), index=True)
    time = db.Column(db.String(32), index=True)
    price = db.Column(db.String(32), index=True)
    tag = db.Column(db.String(10), index=True)

    def get_id(self):
        return self.id
    def get_title_film(self):
        return self.title_film
    def get_title_cinema(self):
        return self.title_cinema
    def get_location(self):
        return self.location
    def get_date(self):
        return self.date
    def get_time(self):
        return self.time
    def get_price(self):
        return self.price
    def get_tag(self):
        return self.tag


class Film(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(32), index=True)
    url_picture = db.Column(db.String(100), index=True)
    url_trailer = db.Column(db.String(100), index=True)
    description = db.Column(db.String(1000), index=True)
    comments = db.relationship('Comment', backref='film_parrent', lazy='dynamic')

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
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), index=True)
    password_hash = db.Column(db.String(64))
    email = db.Column(db.String(64), index=True)
    photo = db.Column(db.String(100), index=True)
    personal_info = db.relationship('Post', backref='author', lazy='dynamic')

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



class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    header = db.Column(db.String(100), index=True)
    body = db.Column(db.String(500), index=True)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    film_id = db.Column(db.Integer, db.ForeignKey('film.id'))
    author_id = db.Column(db.Integer, index=True)
    header = db.Column(db.String(100), index=True)
    body = db.Column(db.String(500), index=True)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
