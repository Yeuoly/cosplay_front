import { isMobile, getIp } from './base'
import { api_get_location_by_ip } from '../api/ip'

export const getLocationByCurrentIp = () => new Promise(resolve => {
    getIp().then(ip => {
        if (ip) {
            api_get_location_by_ip(ip).then(location => {
                resolve(location)
            })
        } else {
            resolve(null)
        }
    })
})

export const getLocation = () => new Promise(resolve => {
    if(isMobile) {
        navigator.geolocation.getCurrentPosition(position => {
            resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
        }, () => {
            getLocationByCurrentIp().then(location => {
                resolve(location)
            })
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 1000
        })
    } else {
        getLocationByCurrentIp().then(location => {
            resolve(location)
        })
    }
})