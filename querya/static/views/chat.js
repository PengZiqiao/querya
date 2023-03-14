const { createApp } = Vue
const { createVuetify } = Vuetify

const vuetify = createVuetify()

const app = createApp({
    // 数据
    data() {
        return {
            form: {
                // 系统消息
                systemMessage: 'You are a helpful assistant.',
                // 少量样本提示
                fewShotPrompting: [],
                // 温度
                temperature: 0,
                // 提示
                prompt: '',
                // 聊天记录
                prompts: []
            },

            dialogForm: {
                // 用户提示内容
                user_content: '',
                // 助理提示内容
                assistant_content: ''
            },

            // 加载状态
            loading: false,

            // 对话框显示
            chatFormDrawer: false,

            // 表单验证
            rules: {
                required: [v => !!v || 'Value is required']
            }
        }
    },

    methods: {
        // 发送消息
        send: function () {

            // prompts增加用户输入
            this.form.prompts.push({ role: 'user', content: this.form.prompt });
            // 清空form.prompt   
            this.form.prompt = '';
            // 设置加载状态为true
            this.loading = true;
            // 调用后端获取回复并更新prompts
            axios
                .post('/chat/send', this.form)
                .then(response => {
                    // 取消加载状态
                    this.loading = false;
                    // 更新prompts
                    this.form.prompts.push({ role: 'assistant', content: response.data });
                });
        },

        // 清除聊天记录
        clear_prompts: function () {
            this.form.prompts = [];
            this.form.prompt = '';
        },

        // 取消添加Few-shot prompting
        cancel_add: function () {
            // 隐藏对话框并清空输入
            this.dialogVisible = false;
            this.dialogForm.user_content = '';
            this.dialogForm.assistant_content = '';
        },

        // 添加Few-shot prompting
        add: function () {
            // 验证表单
            this.$refs['dialogForm'].validate((valid) => {
                // 如果验证通过
                if (valid) {
                    // 添加用户提示内容到 fewShotPrompting 列表中
                    this.form.fewShotPrompting.push(
                        { "role": "system", "name": "example_user", "content": this.dialogForm.user_content });
                    // 添加助理提示内容到 fewShotPrompting 列表中
                    this.form.fewShotPrompting.push(
                        { "role": "system", "name": "example_assistant", "content": this.dialogForm.assistant_content });
                    // 隐藏对话框并清空输入
                    this.dialogVisible = false;
                    this.dialogForm.user_content = '';
                    this.dialogForm.assistant_content = '';
                }
            });
        },

        // 删除Few-shot prompting最后两项
        delete_prompting: function () {
            if (this.form.fewShotPrompting.length >= 2) {
                this.form.fewShotPrompting.splice(this.form.fewShotPrompting.length - 2, 2)
            }
        },

        // 定义 marked 方法
        marked: function (markdown) {
            var result = window.marked(markdown);
            return result;
        }
    }
})

app.use(vuetify).mount('#app')