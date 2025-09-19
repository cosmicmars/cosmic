from flask import *
from flask_sqlalchemy import *

app = Flask(__name__)

@app.route('/')
def main_page():
    return render_template('main_page.html')

@app.route('/button1', methods=['POST'])
def button1_action():
    return render_template('ready_courses.html')

@app.route('/button2', methods=['POST'])
def button2_action():
    return render_template('create_course.html')

if __name__ == '__main__':
    app.run(debug=True)

