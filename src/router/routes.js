const Index = () => import('../views/Index.vue')
const Login = () => import('../views/auth/Login.vue')
const GlobalMap = () => import('../views/map/Global.vue')
const Category = () => import('../views/Category.vue')
const CosplayPoint = () => import('../views/CosplayPoint.vue')
const CreateCosplayPoint = () => import('../views/CreateCosplayPoint.vue')
const Admin = () => import('../views/Admin.vue')

import Maps from './map'
import Admins from './admin'

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
}, {
    name: 'category',
    path: '/category',
    component: Category
}, {
    name: 'cosplay_points',
    path: '/cosplay_points',
    component: CosplayPoint
}, {
    name: 'create_cosplay_point',
    path: '/location/create',
    component: CreateCosplayPoint
}, {
    name: 'admin',
    path: '/admin',
    component: Admin,
    children: Admins
}]