import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import EventBus from 'vue3-eventbus'
import VueCookie from 'vue3-cookies'
import axios from 'axios'
import { GetCSRFTOken } from './api/base'
import { api_auth_check, api_get_csrftoken } from './api/auth'
import { SetAttach, SetOnline, SetUid, SetUserName } from './store/user'

(async function(){
  if(process.env.NODE_ENV == "development"){
    axios.defaults.baseURL = "http://cosplay.srmxy.cn"
  }else{
    axios.defaults.baseURL = "http://iotshield.srmxy.cn"
  }
  axios.defaults.withCredentials = true
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

  if (!GetCSRFTOken()){
    await api_get_csrftoken()
  }

  const { data } = await api_auth_check()
  if(data && data['res'] == 1){
    SetUserName(data['data']['nickname'])
    SetUid(data['data']['id'])
    SetAttach(data['data'])
    SetOnline()
  }

  createApp(App)
    .use(VueCookie)
    .use(EventBus)
    .use(router)
    .use(ElementPlus)
    .mount('#app')
})()

