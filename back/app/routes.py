# -*- coding: utf-8 -*-
from flask import render_template, flash, redirect, url_for, jsonify, abort, g, request
from app import app, db, auth, cors
from app.models import User
from flask_cors import CORS, cross_origin
import urllib.request
from bs4 import BeautifulSoup
import json
import sqlite3
import jwt
import datetime




def decode_auth_token(auth_token):
    """
    Decodes the auth token
    :param auth_token:
    :return: integer|string
    """
    try:
        payload = jwt.decode(auth_token, app.config.get('SECRET_KEY'))
        return payload['ID']
    except jwt.ExpiredSignatureError:
        return -1
    except jwt.InvalidTokenError:
        return -2


@app.route('/getCurUserID', methods=["GET", "POST"])
@cross_origin()
def getCurUserID():
    token = request.json.get("token")
    if (token == -1 or token == -2):
        return jsonify({'ID': -1})

    res = decode_auth_token(token.encode())
    if User.query.filter_by(id=res).first() is not None:
        return jsonify({'ID': res})
    else:
        return jsonify({'ID': -1})

def encode_auth_token(user_id):
    """
    Generates the Auth Token
    :return: string
    """
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=500),
            'iat': datetime.datetime.utcnow(),
            'ID': user_id
        }
        return jwt.encode(
            payload,
            app.config.get('SECRET_KEY'),
            algorithm='HS256'
        )
    except Exception as e:
        return "-1"


@app.route('/getToken', methods=["GET", "POST"])
@cross_origin()
def getToken():
    username = request.json.get("username")
    password = request.json.get("password")

    if User.query.filter_by(username=username).first() is None:
        return jsonify({'token': ''})

    user = User.query.filter_by(username=username).first()
    if (not user.verify_password(password)):
        return jsonify({'token': ''})

    token = encode_auth_token(user.id)
    return jsonify({'token': str(token.decode())})





@app.route('/api/users', methods=["POST", "GET"])
@cross_origin()
def new_user():
    username = request.json.get('username')
    password = request.json.get('password')
    if username is None or password is None:
        abort(400)    # missing arguments
    if User.query.filter_by(username=username).first() is not None:
        abort(400)    # existing user

    user = User(username=username)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()

    return (jsonify({'username': user.username}), 201,
            {'Location': url_for('get_user', id=user.id, _external=True)})


@app.route('/api/users/<int:id>')
@cross_origin()
def get_user(id):
    user = User.query.get(id)
    if not user:
        abort(400)
    return jsonify({'username': user.username})


@app.route('/api/token')
@cross_origin()
@auth.login_required
def get_auth_token():
    token = g.user.generate_auth_token(600)
    return jsonify({'token': token.decode('ascii'), 'duration': 600})


@app.route('/api/resource')
@auth.login_required
@cross_origin()
def get_resource():
    return jsonify({'data': 'Hello, %s!' % g.user.username})


@app.route("/ping")
@cross_origin()
def hello():
    return "pong"


@app.route("/get_html")
@cross_origin()
def get_html(url):
    print('uu1')
    responce = urllib.request.urlopen(url)
    print('uu2')
    return responce.read()



@app.route("/parse_more_info")
@cross_origin()
def parse_more_info(html):

    soup = BeautifulSoup(html, features="html.parser")
    table = soup.find('div', attrs={'class': 'mov'})

    more_info = {}

    url_picture = table.find('img', attrs={'class': 'mov__poster'}).attrs["src"]
    more_info['url_picture'] = url_picture

    '''
    move_desk = table.find('div', attrs={'class': 'mov__desc'})
    move_stat = move_desk.find('div', attrs={'mov__stat'})
    tag_a= move_stat.find('a', attrs={'class': 'btn btn--trailer'})
    url_trailer = tag_a.attrs["href"]
    more_info['url_trailer'] = url_trailer

    mov__bottom = move_desk.find('div', attrs={'class': 'mov__bottom'})
    article = mov__bottom.find('article', attrs={'class': 'mov__text'})
    discription = article.text
    more_info['discription'] = discription
    '''

    return more_info



@app.route("/parse_list_of_film", methods=["GET","POST"])
@cross_origin()
def parse_list_of_film(html):

    soup = BeautifulSoup(html)
    catalog = soup.find('div', attrs={'class': 'catalog catalog--places', 'id': 'showsResult'})
    items = catalog.find_all("div", attrs={'class': 'cat_item'})

    cur_id = 0
    films = []

    for item in items:
        cur_id += 1
        #if (cur_id > 11):
        #    break
        id = cur_id

        title = item.div.a.attrs["title"]
        url_film = "https://kontramarka.ua" + item.div.a.attrs["href"]

        more_info = parse_more_info(get_html(url_film))

        films.append({
            'title': title,
            'id': id,
            'url_film': url_film,
            'url_picture': more_info['url_picture']
        })

    return films



@app.route("/clear_films", methods=["GET","POST"])
@cross_origin()
def clear_films():
    conn = sqlite3.connect("mydatabase.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM films")
    conn.commit()
    return "ok_clear"



@app.route("/save_films", methods=["GET","POST"])
@cross_origin()
def save_films(films):

    conn = sqlite3.connect("mydatabase.db")
    cursor = conn.cursor()

    films_db = []

    for film in films:
        films_db.append((film['title'], film['id'], film['url_film'], film['url_picture']))

    cursor.executemany("INSERT INTO films VALUES (?,?,?,?)", films_db)
    conn.commit()



@app.route("/check_db", methods=["GET","POST"])
@cross_origin()
def check_db():
    conn = sqlite3.connect("mydatabase.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM films")
    rows = cursor.fetchall()

    for row in rows:
        print(row)

    return "ok_check"




@app.route("/get_films", methods=["GET","POST"])
@cross_origin()
def get_films():

    conn = sqlite3.connect("mydatabase.db")
    cursor = conn.cursor()

    films = []

    cursor.execute("SELECT * FROM films")
    rows = cursor.fetchall()

    for row in rows:

        films.append({
            'title': row[0],
            'id': row[1],
            'url_film': row[2],
            'url_picture': row[3]
        })


    return json.dumps(films)




@app.route("/parse_sites", methods=["GET","POST"])
@cross_origin()
def parse_sites():

    print('start pars')
    url = 'https://kontramarka.ua/ru/cinema'

    films = parse_list_of_film(get_html(url))

    print('end parse')
    clear_films()
    save_films(films)

    return "ok_parse"