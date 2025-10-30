from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import json
import os# Импортируем функцию из ai_provider.py

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Замените на ваш секретный ключ

JSON_FILE = 'users.json'

# Храним пользователей как словарь: username -> user_info
def load_users():
    if os.path.exists(JSON_FILE):
        with open(JSON_FILE, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if not content:
                return {}
            try:
                data = json.loads(content)
                if isinstance(data, dict):
                    return data
                elif isinstance(data, list):
                    # Миграция: преобразуем список в словарь
                    return {u['username']: u for u in data if 'username' in u}
                else:
                    return {}
            except json.JSONDecodeError:
                return {}
    return {}


def save_users(users):
    with open(JSON_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, ensure_ascii=False, indent=2)

@app.route('/')
def main_page():
    return render_template('main_page.html')

# Регистрация (GET/POST)
@app.route('/register', methods=['GET', 'POST'])
@app.route('/register.html', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        users = load_users()
        if email in users:
            return "Пользователь с этим email уже существует! <a href='/register'>Попробовать снова</a>", 400
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        users[email] = {
            'name': name,
            'password': password_hash.decode('utf-8'),
            'profile_picture': None
        }
        save_users(users)
        # Автовход после успешной регистрации
        session['email'] = email
        return redirect(url_for('profile'))
    return render_template('register.html')


# Вход (GET/POST)
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        users = load_users()
        if email in users and bcrypt.checkpw(password.encode('utf-8'), users[email]['password'].encode('utf-8')):
            session['email'] = email
            return redirect(url_for('profile'))
        return "Неверный email или пароль! <a href='/login'>Попробовать снова</a>", 401
    return render_template('log.html')

@app.route('/button1', methods=['POST'])
def button1_action():
    return render_template('ready_courses.html')

@app.route('/button2', methods=['POST'])
def button2_action():
    return render_template('create_course.html')

# МАРШРУТЫ HTML СТРАНИЧЕК

# Профиль пользователя
@app.route('/profile')
def profile():
    if 'email' not in session:
        return redirect(url_for('login'))
    users = load_users()
    user_info = users.get(session['email'])
    return render_template('profil.html', user_info=user_info)

@app.route('/logout')
def logout():
    session.pop('email', None)
    return redirect(url_for('main_page'))

@app.route('/log.html')
def log_html():
    return render_template('log.html')

_logo_printed = False

def print_logo():
    global _logo_printed
    if not _logo_printed:
        ascii_logo = [
            "                                                 _/            ",
            "    _/_/_/    _/_/      _/_/_/  _/_/_/  _/_/          _/_/_/   ",
            " _/        _/    _/  _/_/      _/    _/    _/  _/  _/          ",
            "_/        _/    _/      _/_/  _/    _/    _/  _/  _/           ",
            " _/_/_/    _/_/    _/_/_/    _/    _/    _/  _/    _/_/_/      "
        ]

        for line in ascii_logo:
            print(line)
        _logo_printed = True

print_logo()

if __name__ == '__main__':
    app.run(debug=True)