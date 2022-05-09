<template>
    <el-container>
        <el-tag class="cos-category-chip" v-for="(i, k) in categories"
            :key="k"
            @click="toRoute(i.route)"
            size="large"
        >
            {{ i.name }}
        </el-tag>
    </el-container>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
    setup() {
        const router = useRouter()

        const categories = [{
            name: '约摄影',
            route: '/date/phd'
        }, {
            name: '摄影地点',
            route: '/cosplay_points'
        }, {
            name: '约妆娘',
            route: '/date/maker'
        }, {
            name: '约后勤',
            route: '/date/logic'
        }]

        const toRoute = path => {
            router.push({ path: path })
        }

        return {
            categories,
            toRoute
        }
    }
}
</script>

<style>
.cos-category-chip {
    margin-left: 10px;
    margin-top: 10px;
}
</style>