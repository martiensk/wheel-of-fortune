import Vue from 'vue';
import Main from './_components/main.vue';
import '../styles/main.scss';

const app = new Vue({
    render: (h) => {
        return h(Main);
    }
});
app.$mount('#app');
// cosmetic change
