# -*- coding: utf-8 -*-
from flask import render_template, flash, redirect, url_for, jsonify, abort, g, request
from app import app, db, auth, cors
from app.models import User, Film, Session, Post, Comment, ReserveComment
from flask_cors import CORS, cross_origin
import urllib.request
from bs4 import BeautifulSoup
import json
import jwt
import datetime
from fuzzywuzzy import fuzz
from transliterate import translit
import re




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
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=50000),
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


@app.route('/sign_up', methods=["POST", "GET"])
@cross_origin()
def sign_up():
    username = request.json.get('username')
    password = request.json.get('password')
    email = request.json.get('email')

    print(email)

    if User.query.filter_by(username=username).first() is not None:
        return jsonify({'status': 'ERROR', 'error': 'This login is already taken'})   # existing user
    if User.query.filter_by(email=email).first() is not None:
        return jsonify({'status': 'ERROR', 'error': 'This e-mail is already taken'})    # existing user

    user = User(username=username, email=email)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'status': 'OK'})


@app.route('/get_user/<int:id>', methods=["POST", "GET"])
@cross_origin()
def get_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({'status': 'ERROR', 'error': 'User was not found'})

    posts = user.personal_info.all()
    user_posts = []
    for post in posts:

        user_posts.append({
            'id': post.id,
            'user_id': post.user_id,
            'header': post.header,
            'body': post.body,
            'timestamp': (str)(post.timestamp)
        })


    info = {
        'id': id,
        'username': user.username,
        'email': user.email,
        'photo': user.photo,
        'posts': user_posts
    }

    return jsonify({"status": "OK", "result": info})


@app.route('/api/token')
@cross_origin()
@auth.login_required
def get_auth_token():
    token = g.user.generate_auth_token(600)
    return jsonify({'token': token.decode('ascii'), 'duration': 600})



@app.route("/ping")
@cross_origin()
def hello():
    return "pong"


@app.route("/get_html")
def get_html(url):
    responce = urllib.request.urlopen(url)
    return responce.read()


@app.route("/parse_more_info")
def parse_more_info_kontra(html):

    soup = BeautifulSoup(html, features="html.parser")
    table = soup.find('div', attrs={'class': 'mov'})

    more_info = {}

    try:
        url_picture = table.find('img', attrs={'class': 'mov__poster'}).attrs["src"]
        more_info['url_picture'] = url_picture
    except:
        more_info['url_picture'] = '*'

    move_desk = table.find('div', attrs={'class': 'mov__desc'})

    try:
        move_stat = move_desk.find('div', attrs={'mov__stat'})
        tag_a= move_stat.find('a', attrs={'class': 'btn btn--trailer'})
        url_trailer = tag_a.attrs["href"]
        print(url_trailer)
        more_info['url_trailer'] = url_trailer
    except:
        more_info['url_trailer'] = '*'


    try:
        mov_bottom = move_desk.find('div', attrs={'class': 'mov__bottom'})
        article = mov_bottom.find('article', attrs={'class': 'mov__text'})
        description = article.text
        more_info['description'] = description
    except:
        more_info['description'] = '*'


    try:

        wrap = soup.find('div', attrs={'class': '_wrap', 'id': 'buy-ticket'})
        sessions_table = wrap.find('div', attrs={'class': 'sessions'})
        cinema_table = sessions_table.find_all('div', attrs={'class': 'cinema cinemaBlock'})

        #more_info['sessions']
        sessions_list = []
        for cinema in cinema_table:
            cinema_info = cinema.find('div', attrs={'class': 'cinema__name'})
            cinema_name = cinema_info.div.text
            location = cinema_info.p.text
            print(cinema_name)
            cinema_schedule = cinema.find('div', attrs={'class': 'cinema__schedule'})

            days = cinema_schedule.findChildren('div', recursive=False)

            for day in days:
                #date = day.attrs['class'][1][11:] DD:MM:YYYY
                date = day.find('div', attrs={'class': 'spoiler__head active'}).span.text.strip()

                spoiler_body = day.find('div', attrs={'class': 'spoiler__body'})
                time_table = spoiler_body.findChildren('div', recursive=False)

                for tt in time_table:
                    time = tt.a.span.text

                    price = tt.find_all()[2].text.strip()
                    price = re.sub(r'\s+', ' ', price)
                    price = price.strip('.')

                    sessions_list.append({
                        'title_cinema': cinema_name,
                        'location': location,
                        'date': date,
                        'time': time,
                        'price': price
                    })
        more_info['sessions'] = sessions_list

    except:
        more_info['sessions'] = '*'


    return more_info



@app.route("/parse_kontra", methods=["GET","POST"])
def parse_kontra(html):

    soup = BeautifulSoup(html)
    catalog = soup.find('div', attrs={'class': 'catalog catalog--places', 'id': 'showsResult'})
    items = catalog.find_all("div", attrs={'class': 'cat_item'})

    cur_id = 0
    films = []

    for item in items:
        cur_id += 1
        #if (cur_id == 1):
        #    continue

        id = cur_id

        title = item.div.a.attrs["title"]
        url_film = "https://kontramarka.ua" + item.div.a.attrs["href"]
        print(id, title)
        more_info = parse_more_info_kontra(get_html(url_film))

        films.append({
            'title': title,
            'id': id,
            'url_film': url_film,
            'url_picture': more_info['url_picture'],
            'url_trailer': more_info['url_trailer'],
            'description': more_info['description'],
            'sessions_list': more_info['sessions']
        })

    return films



@app.route("/clear_films", methods=["GET","POST"])
def clear_films():
    db.session.query(Film).delete()
    db.session.commit()
    return 'ok_clear_films'

@app.route("/clear_sessions", methods=["GET","POST"])
def clear_sessions():
    db.session.query(Session).delete()
    db.session.commit()
    return 'ok_clear_sessions'



@app.route("/get_sessions_by_title", methods=["GET","POST"])
def get_sessions_by_title(title):
    sessions = Session.query.all()
    sessions_list = []
    tr_title = translit(title, "ru")


    for session in sessions:

        tr_session = translit(session.title_film, "ru")
        score = fuzz.token_sort_ratio(tr_title, tr_session)
        if (score >= 75):
            sessions_list.append({
                'id': session.id,
                'title_film': session.title_film,
                'title_cinema': session.title_cinema,
                'location': session.location,
                'date': session.date,
                'time': session.time,
                'price': session.price,
                'tag': session.tag
        })

    return sessions_list



@app.route("/update_sessions", methods=["GET","POST"])
def update_sessions(film):

    sessions_list = film['sessions_list']

    kol = 0
    for item in sessions_list:
        title_film, title_cinema, location, date, time, price, tag0 = '','','','','','',''
        kol += 1
        print(kol, end = ' ')
        if(kol % 20 == 0):
            print()

        try:
            title_film = film['title']
        except:
            title_film = '*'

        try:
            title_cinema = item['title_cinema']
        except:
            title_cinema = '*'

        try:
            location = item['location']
        except:
            location = '*'

        try:
            date = item['date']
        except:
            date = '*'

        try:
            time = item['time']
        except:
            time = '*'

        try:
            price = item['price']
        except:
            price = '*'

        try:
            tag = item['tag']
        except:
            tag = '*'

        session = Session(title_film = title_film,
                          title_cinema = title_cinema,
                          location = location,
                          date = date,
                          time = time,
                          price = price,
                          tag = tag)
        db.session.add(session)
        db.session.commit()


@app.route("/add_films", methods=["GET","POST"])
def add_films(lst_films):


    for item in lst_films:
        films = Film.query.all()

        tr_item = translit(item['title'], "ru")
        id = 0
        new_film = True
        for film in films:
            tr_film = translit(film.title, "ru")
            score = fuzz.token_sort_ratio(tr_item, tr_film)
            if score >= 75:
                id = film.id
                new_film = False
                break

        if new_film:

            f = Film(title = item['title'],
                     url_picture = item['url_picture'],
                     url_trailer = item['url_trailer'],
                     description = item['description']
                     )
            id = f.id
            db.session.add(f)
            db.session.commit()


        update_sessions(item)
        print('@@@')




@app.route('/get_film/<int:id>', methods=["GET","POST"])
@cross_origin()
def get_film(id):


    film = Film.query.get(id)
    if not film:
        return jsonify({'status': 'ERROR', 'error': 'Film was not found'})

    comments = film.comments.all()
    film_comments = []
    for comment in comments:
        film_comments.append({
            'id': comment.id,
            'author_id': comment.author_id,
            'url_photo_author': User.query.get(comment.author_id).photo,
            'film_id': comment.film_id,
            'header': comment.header,
            'body': comment.body,
            'timestamp': (str)(comment.timestamp)
        })

    info = {
        'title': film.title,
        'id': film.id,
        'url_picture': film.url_picture,
        'url_trailer': film.url_trailer[film.url_trailer.find('=') + 1:],
        'description': film.description,
        'sessions': get_sessions_by_title(film.title),
        'comments': film_comments
    }
    return jsonify({"status": "OK", "result": info})




@app.route("/get_films", methods=["GET","POST"])
@cross_origin()
def get_films():

    films = Film.query.all()
    ans_list = []
    for film in films:

        ans_list.append({
            'title': film.title,
            'id': film.id,
            'url_picture': film.url_picture,
            #'url_trailer': film.get_url_trailer(),
            'description': film.description
            #'sessions': get_sessions_by_title(film.get_title())
        })

    return json.dumps(ans_list)


@app.route("/make_reserve_copy_comments", methods=["GET","POST"])
def make_reserve_copy_comments():
    comments = Comment.query.all()
    for comment in comments:
        film = Film.query.get(comment.film_id)
        if not film:
            continue
        reserve_comment = ReserveComment(author_id=comment.author_id,
                                         header=comment.header,
                                         body=comment.body,
                                         timestamp=comment.timestamp,
                                         film_title=film.title)
        db.session.add(reserve_comment)
        db.session.commit()
    clear_comments()
    return "reserve copy of comments was made"


@app.route("/get_film_id_by_title", methods=["GET","POST"])
def get_film_id_by_title(title):
    films = Film.query.all()
    tr_item = translit(title, "ru")
    ans_id = 0
    for film in films:
        tr_title = translit(film.title, "ru")
        score = fuzz.token_sort_ratio(tr_item, tr_title)
        if (score >= 75):
            ans_id = film.id
            break
    return ans_id


@app.route("/clear_reserve_copy", methods=["GET","POST"])
def clear_reserve_copy():
    db.session.query(ReserveComment).delete()
    db.session.commit()
    return 'ok_clear_reserve_comments'

@app.route("/set_old_comments", methods=["GET","POST"])
def set_old_comments():
    old_comments = ReserveComment.query.all()
    for old_comment in old_comments:
        film_id = get_film_id_by_title(old_comment.film_title)
        if film_id == 0:
            continue
        film = Film.query.get(film_id)
        if not film:
            continue
        comment = Comment(header=old_comment.header,
                          body=old_comment.body,
                          film_parrent=film,
                          author_id=old_comment.author_id,
                          timestamp=old_comment.timestamp
        )
        db.session.add(comment)
        db.session.commit()
    clear_reserve_copy()

@app.route("/parse_sites", methods=["GET","POST"])
def parse_sites():

    print('start pars')

    clear_reserve_copy()
    make_reserve_copy_comments()
    clear_films()
    clear_sessions()

    url_1 = 'https://kontramarka.ua/ru/cinema'
    films_1 = parse_kontra(get_html(url_1))
    print('try add new films')
    add_films(films_1)

    '''
    url_2
    films_2
    
    add_films(films_2)
    
    ...
    ...
    ...
    '''

    set_old_comments()

    print('end parse')
    return "ok_parse"

@app.route("/add_post/<int:id>", methods=["GET","POST"])
def add_post(id):
    header_post = request.json.get('header')
    body_post = request.json.get('body')
    user = User.query.get(id)
    if not user:
        return jsonify({'status': 'ERROR', 'error': 'User was not found'})
    post = Post(header=header_post, body=body_post, author=user)
    db.session.add(post)
    db.session.commit()
    return jsonify({"status": "OK"})


@app.route("/add_comment/<int:id>", methods=["GET","POST"])
def add_comment(id):
    header_comment = request.json.get('header')
    body_comment = request.json.get('body')
    author_id_comment = request.json.get('author_id')

    film = Film.query.get(id)
    user = User.query.get(author_id_comment)
    if not film or not user:
        return jsonify({'status': 'ERROR', 'error': 'Film or User were not found'})

    comment = Comment(header=header_comment, body=body_comment, film_parrent=film, author_id=author_id_comment)
    db.session.add(comment)
    db.session.commit()
    return jsonify({"status": "OK"})

@app.route("/clear_comments", methods=["GET","POST"])
def clear_comments():
    db.session.query(Comment).delete()
    db.session.commit()
    return 'ok_clear_comments'


@app.route("/change_personal_info", methods=["GET","POST"])
@cross_origin()
def change_personal_info():
    name=request.json.get('name')
    password=request.json.get('password')
    new_password = request.json.get('new_password')
    repeat_new_password = request.json.get('repeat_new_password')
    photo_url = request.json.get('photo_url')
    email = request.json.get('email')
    id = request.json.get('id')

    users=User.query.filter_by(username=name)
    for u in users:
        if (int(u.id) != int(id)):
            return jsonify({'status': 'ERROR', 'error': 'Was found user with same username'})

    users = User.query.filter_by(email=email)
    for u in users:
        if (int(u.id) != int(id)):
            return jsonify({'status': 'ERROR', 'error': 'Was found user with same e-mail'})

    user = User.query.get(id)
    if (not user.verify_password(password)):
        return jsonify({'status': 'ERROR', 'error': 'Wrong password'})

    if (new_password != repeat_new_password):
        return jsonify({'status': 'ERROR', 'error': 'Password must be same'})

    #Change_info
    user.username=name
    user.email=email
    user.photo=photo_url
    user.hash_password(new_password)

    return jsonify({"status": "OK"})

@app.route("/del_post", methods=["GET","POST"])
@cross_origin()
def del_post():
    user_id = int(request.json.get('user_id'))
    post_id = int(request.json.get('post_id'))
    #user = User.query.get(user_id)

    post = Post.query.filter_by(id=post_id).first()
    if post is None:
        return jsonify({"status": "ERROR", "error":"post with id={} was not found".format(post_id)})
    if user_id != post.user_id:
        return jsonify({"status": "ERROR",
                        "error": "user with id={0} does not have post with id={1}".format(user_id, post_id)})

    db.session.delete(post)
    db.session.commit()

    return jsonify({"status": "OK"})
