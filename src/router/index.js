import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'

import { ShowBottomNav, HideBottomNav } from '../event/global'

export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

const list_without_bottom_nav = ['login', 'register']
router.beforeEach((to, _, next) => {
    if(list_without_bottom_nav.includes(to.name)){
        HideBottomNav()
    }else{
        ShowBottomNav()
    }

    next()
})