const China = () => import('../components/map/China.vue')
const Hunan = () => import('../components/map/Hunan.vue')

export default [{
    path: '/map/china',
    component: China
}, {
    path: '/map/hunan',
    component: Hunan
}, {
    path: '/map/',
    redirect: '/map/china'
}]