
from flask import Flask
from flask import request
from flask import Response


app = Flask(__name__)

@app.route('/old', methods=['POST'])
def post_old():
    data = request.data
    print('old')
    print(data)
    return data

@app.route('/new', methods=['POST'])
def post_new():
    data = request.data
    print('new')
    print(data)
    return data

if __name__ == '__main__':
    app.run(port=5555)
