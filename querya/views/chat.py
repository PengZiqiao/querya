from flask import Blueprint, render_template, jsonify, request
from ..models import ChatBot

chat = ChatBot()

bp = Blueprint('chat', __name__, url_prefix='/chat')

@bp.route('/')
def index():
    return render_template('chat.html')

@bp.post('/send')
def send():
    # 从请求中获取JSON数据
    data = request.get_json()

    # 获得回复，并返回到前端
    content = chat(
        prompts=data['prompts'],
        temperature=data['temperature'],
        system_message=data['systemMessage'],
        few_shot_prompting=data['fewShotPrompting']
    )

    return jsonify(content)
