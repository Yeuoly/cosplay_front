import { useCookies } from "vue3-cookies"
import axios from 'axios'

const { cookies } = useCookies()

let csrf_token = cookies.get('cosplay_jct') || ''

export const GetCSRFTOken = () => {
    return csrf_token
}

export const SetCSRFToken = token => {
    csrf_token = token
}

export const api_base = (url, method, args) => new Promise( resolve => {
    (async function(){
        args = args || ''
        args = ( args == '' ? '' : args + '&' ) + 'csrf_token=' + csrf_token
        switch(method.toLowerCase()){
            case 'post':
                try{
                    const data = await axios.post(url, args)
                    resolve(typeof data === 'string' ? false : data)
                }catch(e){
                    resolve(false)
                }
                break
            case 'get':
                try{
                    const data = await axios.get(url + '?' + args)
                    resolve(typeof data === 'string' ? false : data)
                }catch(e){
                    resolve(false)
                }
                break
        }
    })()
})