import Vue from 'vue'
import app from './app.vue'
import router from './router'
import VueLazyload from 'vue-lazyload'
import moment from 'moment'
import './common/stylus/fonts.styl'
import './mock/mockServer'
import VueResource from 'vue-resource'
import loading from './loading.gif'

Vue.use(VueResource)  //一旦使用每个组件对象就多了一个属性$http
Vue.use(VueLazyload,{
  loading: loading
})

//注册全局过滤器,
Vue.filter('date-string',function (value) {
  //value为日期的值
  return moment(value).format('YYYY-MM-DD HH:mm:ss')
})

new Vue({
  el:'#app',
  render:h=>h(app),
  router
})
