<template>
<div class="cos-bottom-nav-container"
    :style="{ display: display_mode }"
>
    <div class="cos-bottom-nav">
        <div v-for="(i, k) in routes" 
            :key="k" 
            :style="{ width: each_item_width }"
            @click="toRoute(i.route)"
        >
            {{ i.name }}
        </div>
    </div>
</div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import bus from 'vue3-eventbus'

export default {
    setup() {
        const router = useRouter()
        const routes = ref([{
            name : '地图',
            route : '/map'
        }, {
            name : '约～',
            route : '/date'
        }, {
            name : '我的',
            route : '/profile'
        }])
        const toRoute = route => {
            router.push({ path : route })
        }

        const display_mode = ref('block')
        bus.on('hide-bottom-nav', () => {
            display_mode.value = 'none'
        })
        bus.on('show-bottom-nav', () => {
            display_mode.value = 'block'
        })

        const each_item_width = computed(() => {
            return parseInt(100 / routes.value.length) + '%'
        })

        return {
            display_mode,
            toRoute,
            routes,
            each_item_width
        }
    }
}
</script>

<style>
.cos-bottom-nav-container {
    width: 100%;
    background-color: rgb(197, 255,198);
    position: fixed;
    bottom: 0;
}

.cos-bottom-nav {
    padding-left: 40px;
    padding-right: 40px;
    width: calc(100% - 80px);
}

.cos-bottom-nav div {
    padding-top: 10px;
    padding-bottom: 10px;
    display: inline-block;
    text-align: center;
    transition: all .2s;
}

.cos-bottom-nav div:hover {
    cursor: pointer;
    background-color: rgb(167, 247, 168);
    border-radius: 8px;
}

</style>