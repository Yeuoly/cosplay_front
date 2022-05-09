import { api_base } from './base'
import axios from 'axios'

export const api_get_ip = () => api_base('/ip/get', 'get')

export const api_get_location_by_ip = ip => new Promise(resolve => {
    (async function() {
        try {
            const { data } = await axios.get(`https://ipapi.co/${ip}/json/`, {
                withCredentials: false
            })
            resolve({
                latitude: data.latitude,
                longitude: data.longitude
            })
        } catch {
            resolve(null)
        }
    })()
})