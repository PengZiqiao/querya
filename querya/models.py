from pathlib import Path
from llama_index import Document, GPTSimpleVectorIndex, LLMPredictor
from langchain.llms import OpenAIChat
import openai
import os

def write_doc(name, content):
    p = Path(f'documents/{name}.txt')
    p.touch()
    p.write_text(content)

# 对prompts进行切片，保留最后几项以控制总字符串长度
def slice_prompts(prompts):
    # 初始化变量，记录 prompts 列表中的消息内容的总长度、子列表的起始索引
    total_length = 0
    start_index = -1

    # 使用 reversed 函数对 prompts 列表进行反向迭代，从最后一条消息开始遍历
    for message in reversed(prompts):
        # 把当前消息的内容的长度累加到 total_length 变量上
        total_length += len(message["content"])
        # 如果 total_length 变量大于 2000，就跳出循环
        if total_length > 2000:
            break
        start_index -= 1
    # 返回 prompts 倒数start_index-1位
    return prompts[start_index:]

class DocIndex:
    def __init__(self) -> None:
        self.documents=[]
        for f in Path('documents').iterdir():
            content = f.read_text()
            name = f.stem
            self.documents.append(Document(content, name))

        self.initialize_index()

        self.llm_predictor = LLMPredictor(llm=OpenAIChat(model_name="gpt-3.5-turbo", temperature=0))

    def initialize_index(self):
        index_json = Path('index.json')
        if index_json.exists():
            self.index = GPTSimpleVectorIndex.load_from_disk('index.json')

        else:
            self.index = GPTSimpleVectorIndex(self.documents, chunk_size_limit=256)
            self.index.save_to_disk('index.json')

    def query(self, prompt):
        res = self.index.query(prompt, mode="embedding", llm_predictor=self.llm_predictor)

        response = res.response
        doc_id = res.source_nodes[0].doc_id
        node_info = res.source_nodes[0].node_info

        source_text = [each.text for each in self.documents if each.doc_id ==doc_id][0]
        source_text = source_text[:node_info['start']] + "<mark>" + source_text[node_info['start']:node_info['end']] + "</mark>" + source_text[node_info['end']:]

        return response, source_text, doc_id

    def insert_into_index(self, name, content):
        write_doc(name, content)

        document = Document(content, name)
        self.documents.append(document)
        self.index.insert(document)

class ChatBot:
    def __init__(self):
        openai.api_key = os.environ['OPENAI_API_KEY']

    def __call__(self, prompts, temperature=0, system_message=None, few_shot_prompting=None):
        # 如果有 few_shot_prompting 参数，就把它到 prompts 列表前面
        if few_shot_prompting:
            prompts = few_shot_prompting + prompts

        # 如果有 system_message 参数，就把它作为第一个消息添加到 prompts 列表中
        if system_message:
            prompts = [{'role': 'system', 'content': system_message}] + prompts

        # 对prompts进行切片，控制字符长度
        prompts = slice_prompts(prompts)

        # 使用 openai 的 ChatCompletion 方法
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=prompts,
            temperature=temperature
        )
        # 从响应中获取第一个选择的消息的内容，并返回
        content = response['choices'][0]['message']['content']
        return content