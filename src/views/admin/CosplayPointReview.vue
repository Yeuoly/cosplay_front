<template>
    <div class="cos-point-review">
        <div class="cos-point-review-item"
            v-for="(i, k) in points" :key="k"
        >
            <el-card>
                <el-button type="primary" @click="checkCosplayPoint(i.id, 1)">通过</el-button>
                <el-button type="danger" @click="checkCosplayPoint(i.id, 0)">拒绝</el-button>
                <p></p>
                <cosplay-point-card
                    :name="i.name"
                    :description="i.description"
                    :cover="i.r_cover[0]"
                    :latitude="i.latitude"
                    :longitude="i.longitude"
                    :status="i.status"
                    :location="i.r_address.name"
                ></cosplay-point-card>
            </el-card>
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue-demi'
import { api_get_unchecked_cosplay_point, api_preview_cosplay_point } from '../../api/admin'
import { makePlaceComplete } from '../../conf/location'
import { ErrorMessage } from '../../event/message'
import CosplayPointCard from '../../components/common/CosplayPointCard.vue'
export default {
    components : { CosplayPointCard },
    setup() {
        const points = ref([])
        const page = ref(1)

        const getUncheckedCosplayPoint = async page => {
            const { data } = await api_get_unchecked_cosplay_point(page, 10)
            if(data && data['res'] == 0) {
                if (data['data']){
                    for(let i of data['data']) {
                        i = makePlaceComplete(i)
                    }
                    points.value = data['data']
                } else {
                    points.value = []
                }
            } else {
                ErrorMessage(data ? data['err'] : '获取数据失败')
            }
        }

        const checkCosplayPoint = async (id, status) => {
            const { data } = await api_preview_cosplay_point(id, status)
            if(data && data['res'] == 0) {
                getUncheckedCosplayPoint(page.value)
            } else {
                ErrorMessage(data ? data['err'] : '修改失败')
            }
        }

        watch(page, v => {
            getUncheckedCosplayPoint(v)
        }, { immediate : true })

        return {
            page,
            points,
            getUncheckedCosplayPoint,
            checkCosplayPoint
        }
    }
}
</script>

<style>

</style>