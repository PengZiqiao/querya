from flask import Blueprint, url_for, redirect

bp = Blueprint('index', __name__)

@bp.route('/')
def index():
    # 首页暂时重定向到chat功能页
    return redirect(url_for('chat.index'))