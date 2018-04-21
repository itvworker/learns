import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './app';
import routes from './router.js'
import './style/index.less';




Vue.use(VueRouter);
Vue.config.devtools = true;
const router = new VueRouter({
    //mode: 'history',
    routes
})

new Vue({
    el: '#app',
    router: router,
    render: h => h(App),  
})