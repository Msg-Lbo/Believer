import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
// import axios from '@/http'
// ↑加载动画↓无加载动画
import axios from 'axios'
import './assets/css/reset.css'
import './assets/icon/iconfont.css'
// github主题
// import VMdEditor from '@kangc/v-md-editor';
// import '@kangc/v-md-editor/lib/style/base-editor.css';
// import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
// import '@kangc/v-md-editor/lib/theme/style/github.css';
// import hljs from 'highlight.js';
// vuepress主题
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';
// 编辑器预览
import VMdPreviewHtml from '@kangc/v-md-editor/lib/preview-html';
import '@kangc/v-md-editor/lib/style/preview-html.css';

// 编辑器tip插件
// import createTipPlugin from '@kangc/v-md-editor/lib/plugins/tip/index';
import '@kangc/v-md-editor/lib/plugins/tip/tip.css';
// 编辑器快捷复制代码插件
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';;
// 统计
import '@/assets/js/count.js'
// VMdEditor.use(githubTheme, {
//   Hljs: hljs,
// });


VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});
// VueMarkdownEditor.use(createTipPlugin());
VueMarkdownEditor.use(createCopyCodePlugin());

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.config.globalProperties.$axios = axios;
app.use(ElementPlus)
app.use(store)
app.use(router)
app.mount('#app')
app.use(VueMarkdownEditor)
app.use(VMdPreviewHtml)

