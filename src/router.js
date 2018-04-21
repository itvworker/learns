export default [
    {
        name: 'home',
        path: '',
        component: function (resolve) {
            require(['./view/index.vue'], resolve)
        }

    }
]