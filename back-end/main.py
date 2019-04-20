# -*- coding: utf-8 -*-

from flask  import Flask
import urllib.request
from bs4 import BeautifulSoup
import json
import sqlite3
from flask_cors import CORS, cross_origin




'''
conn = sqlite3.connect("mydatabase.db")  # или :memory: чтобы сохранить в RAM
cursor = conn.cursor()
cursor.execute("""CREATE TABLE films
                  (title text, id integer, url_film text,
                   url_picture text)
               """)
'''




app = Flask(__name__)
cors = CORS(app)



@app.route("/ping")
@cross_origin()
def hello():
    return "pong"






@app.route("/get_html")
@cross_origin()
def get_html(url):
    responce = urllib.request.urlopen(url)
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


    soup = BeautifulSoup(html, features="html.parser")
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


    url = 'https://kontramarka.ua/ru/cinema'
    films = parse_list_of_film(get_html(url))

    clear_films()
    #check_db()
    save_films(films)

    #return json.dumps(all_films)

    return "ok_parse"







if __name__ == "__main__":
    app.run()

