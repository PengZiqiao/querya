const { createApp } = Vue
const { createVuetify } = Vuetify

const vuetify = createVuetify()

const app = createApp({
    // 数据
    data() {
        return {
            // 表单数据
            chatForm: {
                // 提示
                prompt: '',
                // 回复模式
                responseMode: 'default',
                // 文档名称
                docNames: []
            },

            // 添加文档
            addDocForm: {
                name: '',
                content: ''
            },

            // select的选项
            items: {
                responseMode: ['default', 'compact', 'tree_summarize'],
                docNames: []
            },

            // 表单验证
            rules: {
                required: [v => !!v || 'Value is required']
            },

            // 聊天记录
            chatList: [
            ],

            // 源文档
            source: "",
            sourceTitle:"",

            // 各种状态
            sourceDrawer: false,
            chatFormDrawer: false,
            addDocDialog: false,
            addDocProcessing: false,
            queryProcessing: false
        }
    },

    // 方法
    methods: {
        // 发送查询
        query() {
            this.queryProcessing = true;
            this.chatList.push({ role: 'user', content: this.chatForm.prompt });
            axios
                .post('/query/query', this.chatForm)
                .then(response => {
                    this.queryProcessing = false;
                    this.chatList.push({ role: 'assistant', content: response.data.response, source: response.data.source, title: response.data.title });
                    this.chatForm.prompt = '';
                });
        },

        // 展示源文档
        showSource(index){
            this.source = this.chatList[index].source;
            this.sourceTitle = this.chatList[index].title;
            this.sourceDrawer = true;
        },

        // 添加文档
        addDoc() {
            // 播放动画
            this.addDocProcessing = true;
            axios
                .post('/query/add_doc', this.addDocForm)
                .then(response => {
                    // 取消动画, 并关闭窗口
                    this.addDocProcessing = false;
                    this.cancelAddDoc()
                    // 更新docNames
                    this.items.docNames = response.data;
                });
        },

        // 取消添加文档
        cancelAddDoc() {
            this.addDocDialog = false;
            this.addDocForm.name = '';
            this.addDocForm.content = '';
        },

        // 获得文档列表
        getDocNames() {
            axios
                .get('/query/get_doc_names')
                .then(response => {
                    // 更新docNames
                    this.items.docNames = response.data
                });
        },

        // 定义 marked 方法
        marked: function (markdown) {
            var result = window.marked(markdown);
            return result;
        }

    },

    // 创建钩子
    created() {
        this.getDocNames()
    }
})

app.use(vuetify).mount('#app')