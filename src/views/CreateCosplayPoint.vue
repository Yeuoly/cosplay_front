<template>
    <el-container>
        <el-row>
            <el-col :span="24">
                <div ref="chart"></div>
            </el-col>
        </el-row>
    </el-container>
</template>

<script>
import { getCurrentInstance, onMounted } from 'vue'
import { getLocation } from '../util/gps'
import { init } from 'echarts'

import 'echarts/extension/bmap/bmap'

export default {
    setup() {
        const instance = getCurrentInstance()
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
            const bmap = map.getModel().getComponent('bmap').getBMap()
            bmap.addEventListener('click', e => {
                console.log({
                    longitude: e.point.lng,
                    latitude: e.point.lat,
                })
            })
        })

        return {
        }
    }
}
</script>

<style>

</style>