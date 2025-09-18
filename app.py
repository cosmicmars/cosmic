from flask import *

app = Flask(__name__)

@app.route('/')
def main_page():
    return render_template('main_page.html')

@app.route('/button1', methods=['POST'])
def button1_action():
    # Логика для кнопки 1
    return "Кнопка 1 нажата!"

@app.route('/button2', methods=['POST'])
def button2_action():
    # Логика для кнопки 2
    return "Кнопка 2 нажата!"

if __name__ == '__main__':
    app.run(debug=True)

