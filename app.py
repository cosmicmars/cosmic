from flask import Flask, render_template, request, redirect, url_for
import json
import os

app = Flask(__name__)

JSON_FILE = 'users.json'

def load_users():
    if os.path.exists(JSON_FILE):
        with open(JSON_FILE, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if not content:
                return []
            try:
                data = json.loads(content)
                if isinstance(data, list):
                    return data
                else:
                    return []
            except json.JSONDecodeError:
                return []
    return []

def save_users(users):
    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, ensure_ascii=False, indent=2)

@app.route('/')
def main_page():
    return render_template('main_page.html')


# Оба маршрута /register и /register.html отображают register.html
@app.route('/register', methods=['GET'])
@app.route('/register.html', methods=['GET'])
def register_page():
    return render_template('register.html')

@app.route('/register', methods=['POST'])
def register():
    username = request.form['username']
    password = request.form['password']
    first_name = request.form['first_name']
    last_name = request.form['last_name']
    age = request.form['age']
    about_me = request.form.get('about_me', '')

    users = load_users()
    for user in users:
        if user['username'] == username:
            return "Пользователь с таким именем уже существует! <a href='/register'>Попробовать снова</a>"

    new_user = {
        'username': username,
        'password': password,
        'first_name': first_name,
        'last_name': last_name,
        'age': int(age),
        'about_me': about_me
    }
    users.append(new_user)
    save_users(users)

    return redirect(url_for('main_page'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    users = load_users()
    for user in users:
        if user['username'] == username and user['password'] == password:
            return redirect(url_for('profile'))

    return "Неверное имя пользователя или пароль! <a href='/login'>Попробовать снова</a>"

@app.route('/button1', methods=['POST'])
def button1_action():
    return render_template('ready_courses.html')

@app.route('/button2', methods=['POST'])
def button2_action():
    return render_template('create_course.html')

# МАРШРУТЫ HTML СТРАНИЧЕК
@app.route('/profile') 
def profile():
    return render_template('profil.html')

@app.route('/log.html')
def log_html():
    return render_template('log.html')

if __name__ == '__main__':
    app.run(debug=True)
