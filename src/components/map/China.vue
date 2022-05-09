<template>
<div class="cos-chart-wapper">
    <div ref="chart" style="width: 100%; height: 900px;"></div>
</div>
</template>

<script>
import ChinaJSON from '../../assets/map/china.json'
import { init, registerMap } from 'echarts'
import { getCurrentInstance, onMounted, onUnmounted } from 'vue'
import { city_cn2en, isLocationAllowed } from '../../conf/location'
import { useRouter } from 'vue-router'

registerMap('china', ChinaJSON)

export default {
    setup() {
        const router = useRouter()

        onMounted(() => {
            const self = getCurrentInstance()
            const chart = self.ctx.$refs.chart
    
            const echart = init(chart)
            const options = {
                tooltip: {
                    show: true
                },
                geo: {
                    type: "map",
                    map: "china",
                    roam: true,
                    zoom: 1.23,
                    // geoIndex: 1,
                    // aspectScale: 0.75, //长宽比
                    showLegendSymbol: false, // 存在legend时显示
                    label: {
                        normal: {
                            show: true
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            color: "white"
                        }
                    }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: "pink",
                            borderColor: "#389dff",
                            borderWidth: 0.5
                        },
                        emphasis: {
                            areaColor: "white",
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowBlur: 5,
                            borderWidth: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)",
                            textStyle: {
                                color: "black"
                            }
                        }
                    }
                },
                series: [{
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    geoIndex: 0,
                    symbolSize: function(params) {
                        return (params[2] / 100) * 15 + 5
                    },
                    itemStyle: {
                        color: '#b02a02'
                    },
                    encode: {
                        tooltip: 2
                    },
                    data: [
                        [111.53, 27.51, 100]
                    ]
                }]
            }
    
            echart.setOption(options)
            echart.on('click', e => {
                if(e.componentType == 'geo'){
                    const city = e.name
                    if(isLocationAllowed(city)){
                        const route_name = city_cn2en(city)
                        router.push({ path: `/map/${route_name}`})
                    }
                }

                return true
            })

            const Resize = () => {
                echart.resize()
            }

            window.addEventListener('resize', Resize)

            onUnmounted(() => {
                window.removeEventListener('resize', Resize)
            })
        })
    }
}
</script>

<style>
.cos-chart-wapper {
    width: 100%;
    height: 600px;
}
</style>