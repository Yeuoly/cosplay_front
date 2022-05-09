import { computed } from 'vue-demi'
import { api_get_ip } from '../api/ip'

export const isMobile = computed(() => {
    const ua = navigator.userAgent
    const isAndroid = ua.indexOf('Android') > -1
    const isIOS = ua.indexOf('iPhone') > -1
    const isIPad = ua.indexOf('iPad') > -1
    const isIPod = ua.indexOf('iPod') > -1
    const isSymbian = ua.indexOf('Symbian') > -1
    const isWindowsPhone = ua.indexOf('Windows Phone') > -1
    return isAndroid || isIOS || isIPad || isIPod || isSymbian || isWindowsPhone
})

const client_ip = []
export const getIp = () => new Promise(resolve => {
    (async function() {
        const { data } = await api_get_ip()
        if(data && data['res'] == 0) {
            client_ip.push(data['data'])
            resolve(data['data'])
        } else {
            resolve(client_ip[client_ip.length - 1])
        }
    })()
})