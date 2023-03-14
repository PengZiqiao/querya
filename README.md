# Querya

## 提供了两个功能：
 - 一个是基本的调用openai的gpt3.5模型进行聊天
 - 一个是使用llama对文档进行embedding、index。然后可以使用index.query

## 安装与使用：
 - 首先添加环境变量OPENAI_API_KEY
 - 按需安装依赖，请使用python3.10
    ```
    pip install -r requirements.txt
    ```
 - 如果是开发测试，直接使用flask启动
    ```
    export FLASK_APP=querya
    flask run  --host=0.0.0.0 --port=80 --debug
    ```
 - 如果是部署在生产服务器，使用unicone
    ```
    gunicorn --workers=2 -b 0.0.0.0:80 wsgi:application
    ```

## TODO
- 完善chat模式下添加few-shot prompting功能
- 添加query模式一上传文件、读取数据库功能
- 添加其他功能模块，如使用配合使用google、bing等搜索引擎等