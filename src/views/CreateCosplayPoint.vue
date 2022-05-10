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
                    <el-button :icon="Search"></el-button>
                </template>
            </el-input>
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
                    <el-button type="primary">
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
import { init } from 'echarts'
import { Search } from '@element-plus/icons-vue'

import 'echarts/extension/bmap/bmap'

export default {
    setup() {
        const instance = getCurrentInstance()

        // baidu map instance, it will be set in mounted
        let bmap;

        // search point keyword
        const search_keyword = ref('')

        // mark point drawer
        const drawer_open = ref(false)
        const drawer_current_point = ref({
            latitude: 0,
            longitude: 0,
            name: '',
            description: '',
            covers: []
        })

        // search point result drawer
        const search_result_drawer_open = ref(false)
        const search_results = ref([])
        const zoomToPoint = (longitude, latitude) => {
            bmap.centerAndZoom(new window.BMap.Point(longitude, latitude), 16)
        }

        onMounted(async () => {
            // handle map
            const location = await getLocation() || { latitude: 28.1987, longitude: 112.9709 }
            const chart = instance.ctx.$refs.chart
            chart.style.width = `${screen.availWidth}px`
            chart.style.height = `${screen.availHeight}px`
            const map = init(chart)
            const options = {
                tooltip: {
                    show: true
                },
                bmap: {
                    center: [location.longitude, location.latitude],
                    zoom: 13,
                    roam: true,
                    mapStyle: {
                        styleJson: [
                            {
                                'featureType': 'water',
                                'elementType': 'all',
                                'style': {
                                    'color': '#d1e6ff'
                                },
                                'name': '水系'
                            },
                            {
                                'featureType': 'land',
                                'elementType': 'all',
                                'style': {
                                    'color': '#f3f8ff'
                                },
                                'name': '陆地'
                            },
                            {
                                'featureType': 'boundary',
                                'elementType': 'geometry',
                                'style': {
                                    'color': '#fbdc00'
                                },
                                'name': '边界'
                            },
                            {
                                'featureType': 'manmade',
                                'elementType': 'all',
                                'style': {
                                    'color': '#d1e6ff'
                                },
                                'name': '人造矿产'
                            },
                            {
                                'featureType': 'local',
                                'elementType': 'all',
                                'style': {
                                    'color': '#d1e6ff'
                                },
                                'name': '局部'
                            },
                        ],
                    },
                },
                series: [{
                    type: 'effectScatter',
                    coordinateSystem: 'bmap',
                    data: [],
                    symbolSize: function(params) {
                        return (params[2] / 100) * 15 + 5
                    },
                    itemStyle: {
                        color: '#b02a02'
                    },
                    encode: {
                        tooltip: 2
                    }
                }]
            }
            map.setOption(options)

            bmap = map.getModel().getComponent('bmap').getBMap()
            bmap.addEventListener('click', e => {
                const coordinate = {
                    longitude: e.point.lng,
                    latitude: e.point.lat
                }
                const Geo = new window.BMap.Geocoder();      
                Geo.getLocation(e.point, function(result){      
                    if (result){      
                        drawer_current_point.value.name = result.address
                    }      
                });
                drawer_current_point.value.latitude = coordinate.latitude
                drawer_current_point.value.longitude = coordinate.longitude
                drawer_open.value = true
            })
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
            const searcher = new window.BMap.LocalSearch(bmap, search_options)
            watch(search_keyword, value => {
                searcher.search(value)
            })
        })

        return {
            drawer_open,
            isMobile,
            drawer_current_point,
            search_keyword,
            Search,
            search_result_drawer_open,
            search_results,
            zoomToPoint
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
    background-color: white;
    padding: 10px;
    position: absolute;
    top: 70px;
    left: 10px;
    width: calc(100% - 40px);
    border-radius: 5px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
}
</style>