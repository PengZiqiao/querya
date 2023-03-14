from flask import Flask


def create_app():
    app = Flask(__name__)

    # 改写jinja模板变量的标记，防止和vuejs冲突
    app.jinja_env.variable_start_string = '{['
    app.jinja_env.variable_end_string = ']}'

    # 注册蓝图
    from .views import index, chat, query
    app.register_blueprint(index.bp)
    app.register_blueprint(chat.bp)
    app.register_blueprint(query.bp)

    return app
