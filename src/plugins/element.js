// 调用具体的组件
import ElementUI from 'element-ui'
import Vue from 'vue'
import {
    Message,
    MessageBox,
} from 'element-ui'
Vue.use(ElementUI)
Vue.prototype.$message = Message
Vue.prototype.$confirm  = MessageBox.confirm