<template>
    <div class="cos-admin">
        <div class="cos-admin-nav">
            <el-card>
                <div class="cos-admin-nav-title">导航</div>
                <el-tag class="cos-admin-nav-item" 
                    v-for="(i, k) in routes" 
                    :key="k" size="large"
                    @click="toRoute(i.route)"
                >
                    {{ i.name }}
                </el-tag>
            </el-card>
        </div>
        <div class="cos-admin-extend">
            <el-card>
                <router-view></router-view>
            </el-card>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
    setup() {
        const router = useRouter()

        const routes = [
            {
                name : '地点审核',
                route : '/admin/cosplay_point_review'
            }, {
                name : '地点后台数据',
                route : '/admin/cosplay_point_data'
            }
        ]

        const toRoute = route => {
            router.push({ path : route })
        }

        return {
            routes,
            toRoute
        }
    }
}
</script>

<style>
.cos-admin-nav {
    padding: 20px 0;
}

.cos-admin-nav-title {
    font-size: 20px;
    padding-bottom: 20px;
}

.cos-admin-nav-item {
    margin-right: 10px;
}
</style>