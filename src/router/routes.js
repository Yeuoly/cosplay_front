const Index = () => import('../views/Index.vue')
const Login = () => import('../views/auth/Login.vue')
const GlobalMap = () => import('../views/map/Global.vue')

import Maps from './map'

export const routes = [{
    name: 'index',
    path: '/',
    component: Index
}, {
    name: 'login',
    path: '/login',
    component: Login
}, {
    name: 'globalmap',
    path: '/map',
    component: GlobalMap,
    children: Maps
}]