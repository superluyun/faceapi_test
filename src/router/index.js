import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import face_api from '@/components/face-api'
import webcam from '@/components/webcam'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path:'/face',
      name:'face',
      component:face_api
    },
    {
      path:'/webcam',
      name:'webcam',
      component:webcam
    },
    
  ]
})
