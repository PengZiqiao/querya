from flask import Blueprint, render_template, jsonify, request
from ..models import write_doc, DocIndex
from time import sleep

doc_index = DocIndex()

bp = Blueprint('query', __name__, url_prefix='/query')

@bp.route('/')
def index():
    return render_template('query.html')

@bp.route('/upload_file', methods=['POST'])
def upload_file():
    return 'upload_file.html'

@bp.route('/query', methods=['POST'])
def query():
    data = request.get_json()
    response, source, title = doc_index.query(data['prompt'])
    return jsonify({'response':response, 'source':source, 'title':title})

@bp.get('/get_doc_names')
def get_doc_names():
    return jsonify(['a','b','c'])

@bp.post('/add_doc')
def add_doc():
    data = request.get_json()
    write_doc(data['name'], data['content'])
    return jsonify(['a', 'b', 'c', 'd'])
