const China = () => import('../components/map/China.vue')

export default [{
    path: '/map/china',
    component: China
}, {
    path: '/map/',
    redirect: '/map/china'
}]