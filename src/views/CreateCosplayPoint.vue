<template>
    <el-container>
        <el-row>
            <el-col :span="24">
                <div ref="chart"></div>
            </el-col>
        </el-row>
        <div class="cos-search-input">
            <el-input
                label="搜索"
                placeholder="请输入搜索内容"
                v-model="search_keyword"
            >
                <template #append>
                    <el-button :icon="Search" @click="searchSearch"></el-button>
                </template>
            </el-input>
        </div>
        <div class="cos-map-zoom-slider">
            <el-slider vertical height="200px" v-model="map_zoom_slider_value"></el-slider>
        </div>
        <el-drawer
            :with-header="false"
            v-model="drawer_open"
            title="标点"
            :direction="isMobile ? 'ttb' : 'rtl'"
        >
            <template #default>
                <el-form>
                    <div class="cos-edit-point-coordinate">坐标经纬：
                        {{drawer_current_point.latitude.toFixed(2)}},
                        {{drawer_current_point.longitude.toFixed(2)}} 
                    </div>
                    <el-input
                        v-model="drawer_current_point.name"
                        placeholder="名称"
                        label="名称"
                    ></el-input>
                    <p></p>
                    <el-input
                        v-model="drawer_current_point.description"
                        autosize
                        type="textarea"
                        placeholder="地点简介"
                    />
                    <p></p>
                    <div v-if="drawer_current_point.id > 0" class="cos-edit-point-covers">
                        <el-row>
                            <el-col :span="8"
                                v-for="(i, k) in drawer_current_point.covers"
                                :key="k"
                            >
                                <div class="cos-edit-point-cover"
                                    :style="{ height: drawer_cover_height}"
                                >
                                    <el-image
                                        fit="cover"
                                        :src="i.src"
                                    ></el-image>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="cos-edit-point-cover"
                                    :style="{ height: drawer_cover_height}"
                                >
                                    <svg role="img" xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 24 24" aria-labelledby="plusIconTitle" stroke="#808080" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter" fill="none" color="#808080"> 
                                        <title id="plusIconTitle">Plus</title> 
                                        <path d="M20 12L4 12M12 4L12 20"/>
                                        <path d="" />
                                    </svg>
                                </div>
                            </el-col>
                        </el-row>
                        <p></p>
                    </div>
                    <el-button type="primary" @click="drawerPointCreate">
                        提交
                    </el-button>
                </el-form>
            </template>
        </el-drawer>
        <el-drawer
            :with-header="false"
            v-model="search_result_drawer_open"
            title="搜索结果"
            direction="btt"
        >
            <template #default>
                <div v-if="search_results.length == 0">
                    <h4>没有搜索到任何匹配结果</h4>
                </div>
                <div v-else>
                    <div v-for="(i, k) in search_results" :key="k"
                        @click="zoomToPoint(i.longitude, i.latitude)"
                    >
                        {{ i.name }}
                        <el-tag v-for="(j, l) in i.tags" :key="l">
                            {{ j }}
                        </el-tag>
                        <el-divider></el-divider>
                    </div>
                </div>
            </template>
        </el-drawer>
    </el-container>
</template>

<script>
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import { getLocation } from '../util/gps'
import { isMobile } from '../util/base'
import { getPlaceCodeByPlaceName } from '../conf/location'
import { init } from 'echarts'
import { Search } from '@element-plus/icons-vue'
import { ErrorMessage, SuccessMessage } from '../event/message'
// import MapStyleJSON from '../components/map/style/edit_point_map_style.json'

import 'echarts/extension/bmap/bmap'
import { api_create_cosplay_point, api_get_scatter_cosplay_points_by_city } from '../api/location'

export default {
    setup() {
        const instance = getCurrentInstance()

        // baidu map instance, it will be set in mounted
        let bmap;
        let bmap_searcher;
        let map;
        // search point keyword
        const search_keyword = ref('')
        // search buttom event
        const searchSearch = () => {
            bmap_searcher.search(search_keyword.value)
        }

        // current city
        const loaded_city = []
        const current_city_name = ref('')
        watch(current_city_name, new_city_name => {
            const code = getPlaceCodeByPlaceName(new_city_name)
            if (code) {
                // check if the city is loaded
                if (!loaded_city.includes(code)) {
                    SuccessMessage(`定位到${new_city_name}，加载中...`)
                    loaded_city.push(code)
                    getCosplayPointsByCid(code)
                    // load this city's cosplay point
                } 
            } else {
                ErrorMessage('当前城市未支持，前面的区域等以后再来探索叭')
            }
        })

        // scatter plot of cosplay point
        const cosplay_points = []
        const getCosplayPointsByCid = async city => {
            const { data } = await api_get_scatter_cosplay_points_by_city(city)
            if(data && data['res'] == 0){
                for(let i of data['data']){
                    cosplay_points.push(i)
                    options.series[0].data.push([i.longitude, i.latitude, 1, i.id])
                }
            } else {
                ErrorMessage(data ? data['err'] : '获取散点数据失败')
            }
            const current_map_center = bmap.getCenter()
            options.bmap.center = [current_map_center.lng, current_map_center.lat]
            map.setOption(options)
        }

        // map zoom slider
        const zoom_percent = ref(100 / 15)
        const map_zoom_slider_value = ref(13 * 100 / 18)
        watch(map_zoom_slider_value, val => {
            bmap.setZoom(val / zoom_percent.value + 3)
        })

        // mark point drawer
        const drawer_open = ref(false)
        const drawer_current_point = ref({
            latitude: 0,
            longitude: 0,
            name: '',
            description: '',
            covers: [],
            origin_data: null,
            id: 0,
            uid: 0
        })
        const drawerPointCreate = async () => {
            const city_code = getPlaceCodeByPlaceName(drawer_current_point.value.origin_data.addressComponents.city)
            const province_code = getPlaceCodeByPlaceName(drawer_current_point.value.origin_data.addressComponents.province)

            if(!city_code || !province_code) {
                ErrorMessage('未开放的区域，前面的区域等以后再来探索吧')
                return
            }

            const { data } = await api_create_cosplay_point(
                drawer_current_point.value.name,
                drawer_current_point.value.description,
                1, province_code, city_code, 
                drawer_current_point.value.latitude, drawer_current_point.value.longitude
            )

            if(data && data['res'] == 0){
                SuccessMessage('创建成功，请等待审核通过')
            } else {
                ErrorMessage(data ? data['err'] : '网络错误')
            }
        }
        const drawer_cover_height = ref(parseInt((screen.availWidth - 40) / 3) + 'px')

        const Geo = new window.BMap.Geocoder();
        const checkChangeCity = () => {
            const center = bmap.getCenter()
            Geo.getLocation(center, result => {
                if (result) {
                    current_city_name.value = result.addressComponents.city
                }
            })
        }
        // search point result drawer
        const search_result_drawer_open = ref(false)
        const search_results = ref([])
        const zoomToPoint = (longitude, latitude) => {
            bmap.centerAndZoom(new window.BMap.Point(longitude, latitude), 16)
        }

        const options = {
            tooltip: {
                show: true
            },
            bmap: {
                center: [0, 0],
                zoom: 13,
                roam: true,
                mapStyle: {
                    styleJson: []
                },
            },
            series: [{
                type: 'effectScatter',
                coordinateSystem: 'bmap',
                data: [],
                symbolSize: function(params) {
                    return 10 + params[2] * 2
                },
                showEffectOn: 'render',
                rippleEffect: {
                    burshType: 'circle',
                },
                itemStyle: {
                    color: '#b02a02'
                },
                encode: {
                    tooltip: 2
                },
            }]
        }

        onMounted(async () => {
            // handle map
            const location = await getLocation() || { latitude: 28.1987, longitude: 112.9709 }
            const chart = instance.ctx.$refs.chart
            chart.style.width = `${screen.availWidth}px`
            chart.style.height = `${screen.availHeight}px`
            map = init(chart)
            options.bmap.center = [location.longitude, location.latitude]
            map.setOption(options)

            bmap = map.getModel().getComponent('bmap').getBMap()
            bmap.addEventListener('click', e => {
                const coordinate = {
                    longitude: e.point.lng,
                    latitude: e.point.lat
                }
                // check if the point is already in the list
                const zoom_percent = bmap.getZoom()
                const target = cosplay_points.find(point => {
                    const power_rate = 0.0005 * zoom_percent
                    return Math.abs(point.longitude - coordinate.longitude) < power_rate
                        && Math.abs(point.latitude - coordinate.latitude) < power_rate
                })
                if(target) {
                    drawer_open.value = true
                    drawer_current_point.value.latitude = target.latitude
                    drawer_current_point.value.longitude = target.longitude
                    drawer_current_point.value.name = target.name
                    drawer_current_point.value.description = target.description
                    drawer_current_point.value.id = target.id
                    drawer_current_point.value.uid = target.uid
                    return
                }

                Geo.getLocation(e.point, result => {      
                    if (result){
                        if(result.surroundingPois.length > 0){
                            drawer_current_point.value.name = result.address + result.surroundingPois[0].title
                        } else {
                            drawer_current_point.value.name = result.address
                        }
                        drawer_current_point.value.origin_data = result
                    }
                });
                drawer_current_point.value.latitude = coordinate.latitude
                drawer_current_point.value.longitude = coordinate.longitude
                drawer_current_point.value.id = 0
                drawer_current_point.value.uid = 0
                drawer_current_point.value.description = ''
                drawer_open.value = true
            })
            bmap.addEventListener('moveend', checkChangeCity)

            // bmap search
            const search_options = {
                onSearchComplete: results => {
                    search_result_drawer_open.value = true
                    if (results && results.Cr) {
                        search_results.value = results.Cr.map(v => {
                            return {
                                name: v.title,
                                longitude: v.point.lng,
                                latitude: v.point.lat,
                                tags: v.tags,
                            }
                        })
                    } else {
                        search_results.value = []
                    }
                },
            }
            bmap_searcher = new window.BMap.LocalSearch(bmap, search_options)
            watch(search_keyword, value => {
                bmap_searcher.search(value)
            })

            // start check change city
            checkChangeCity()
        })

        return {
            drawer_open,
            isMobile,
            drawer_current_point,
            search_keyword,
            Search,
            search_result_drawer_open,
            search_results,
            zoomToPoint,
            searchSearch,
            map_zoom_slider_value,
            drawerPointCreate,
            drawer_cover_height
        }
    }
}
</script>

<style>
.cos-edit-point-coordinate{
    font-size: 12px;
    padding-top: 20px;
    padding-bottom: 20px;
}

.cos-search-input {
    background-color: rgba(255,255,255,0.7);
    padding: 10px;
    position: absolute;
    top: 70px;
    left: 10px;
    width: calc(100% - 40px);
    border-radius: 5px;
}

.cos-map-zoom-slider {
    background-color: rgba(255,255,255,0.7);
    padding-top: 20px;
    padding-bottom: 20px;
    position: absolute;
    right: 10px;
    top: 150px;
    border-radius: 8px;
}

.cos-edit-point-cover {
    width: 100%;
    height: 200px;
}
</style>