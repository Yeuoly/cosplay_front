<template>
    <el-container>
        <el-row>
            <el-col :span="24">
                <div class="cos-points-filter">
                    <span>
                        过滤：
                    </span>
                    <el-cascader
                        v-model="selected_cosplay_point"
                        :options="select_cosplay_point_options"
                        collapse-tags
                        :props="{ checkStrictly: true }"
                    ></el-cascader>
                </div>
            </el-col>
            <el-col :span="24">
                <div class="cos-points-display">
                    <cosplay-point-card
                        v-for="(i, k) in cosplay_points"
                        :key="k"
                        :name="i.name"
                        :description="i.description"
                        :cover="i.r_cover[0]"
                        :latitude="i.latitude"
                        :longitude="i.longitude"
                        :status="i.status"
                        :location="i.r_address.name"
                    ></cosplay-point-card>
                </div>
            </el-col>
        </el-row>
    </el-container>
    <el-affix :offset="90" position="bottom">
        <el-button :icon="Plus" 
            type="primary" 
            id="cos-point-create" 
            circle
            @click="jumpToCreateCosplayPoint"
        ></el-button>
    </el-affix>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { cosplay_points_code, makePlaceComplete } from '../conf/location'
import { 
    api_list_country_cosplay_points,
    api_list_province_cosplay_points,
    api_list_city_cosplay_points,
} from '../api/location'
import { ErrorMessage } from '../event/message'
import { Plus } from '@element-plus/icons-vue'

import CosplayPointCard from '../components/common/CosplayPointCard.vue'

export default {
    components: {
        CosplayPointCard
    },
    setup() {
        const router = useRouter()

        //page
        const page = ref(1)

        //selector of cosplay point filter
        const selected_cosplay_point = ref([1])
        const select_cosplay_point_options = cosplay_points_code.map(v => {
            return {
                value: v.code,
                label: v.country,
                children: v.provinces.map(v => {
                    return {
                        value: v.code,
                        label: v.name,
                        children: v.cities.map(v => {
                            return {
                                value: v.code,
                                label: v.name
                            }
                        })
                    }
                })
            }
        })

        //cosplay points, data to be displayed
        const cosplay_points = ref([])

        //watch the selected cosplay point filter and page
        //update the cosplay points when there is a change
        watch([selected_cosplay_point, page], async () => {
            const country_id = selected_cosplay_point.value[0]
            const province_id = selected_cosplay_point.value[1]
            const city_id = selected_cosplay_point.value[2]
            let callback = null
            if(city_id) {
                callback = () => new Promise( resolve => {
                    api_list_city_cosplay_points(city_id, page.value, 10).then(data => {
                        resolve(data)
                    })
                })
            } else if(province_id) {
                callback = () => new Promise( resolve => {
                    api_list_province_cosplay_points(province_id, page.value, 10).then(data => {
                        resolve(data)
                    })
                })
            } else if(country_id) {
                callback = () => new Promise( resolve => {
                    api_list_country_cosplay_points(country_id, page.value, 10).then(data => {
                        resolve(data)
                    })
                })
            } 
            if(callback) {
                cosplay_points.value.splice(0, cosplay_points.value.length)
                const { data } = await callback()
                if (data && data['res'] === 0){
                    for(let i of data['data']) {
                        makePlaceComplete(i)
                        console.log(i)
                        cosplay_points.value.push(i)
                    }
                }else{
                    ErrorMessage(data ? data['err'] : '网络错误')
                }
            }
        } , { immediate: true })

        //jump to create cosplay point page
        const jumpToCreateCosplayPoint = () => {
            router.push({ path: '/location/create' })
        }

        return {
            jumpToCreateCosplayPoint,
            selected_cosplay_point,
            select_cosplay_point_options,
            cosplay_points,
            Plus,
        }
    }
}
</script>

<style>
.cos-points-filter {
    padding: 10px;
}

.cos-points-display {
    padding: 10px;
}

.cos-point-create-buttom {
    padding-left: 10px;
}

#cos-point-create {
    position: absolute;
    right: 10px;
}
</style>