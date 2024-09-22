import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import MathJax from './js/MathJax';

Vue.config.productionTip = false
Vue.use(ElementUI);

Vue.prototype.MathJax = MathJax

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
