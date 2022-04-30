<template>
<div class="cos-chart-wapper">
    <div ref="chart" style="width: 100%; height: 900px;"></div>
</div>
</template>

<script>
import ChinaJSON from '../../assets/map/china.json'
import { init, registerMap } from 'echarts'
import { getCurrentInstance, onMounted, onUnmounted } from 'vue'

export default {
    setup() {
        registerMap('china', ChinaJSON)
        onMounted(() => {
            const self = getCurrentInstance()
            const chart = self.ctx.$refs.chart
    
            const echart = init(chart)
            const options = {
                tooltip: {
                    show: false
                },
                geo: {
                    map: "china",
                    roam: false,
                    zoom: 1.23,
                    center: [105, 36],
                    label: {
                        normal: {
                            show: true,
                            fontSize: "10",
                            color: "rgba(0,0,0,0.7)"
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: "#0d0059",
                            borderColor: "#389dff",
                            borderWidth: 1, //设置外层边框
                            shadowBlur: 5,
                            shadowOffsetY: 8,
                            shadowOffsetX: 0,
                            shadowColor: "#01012a"
                        },
                        emphasis: {
                            areaColor: "#184cff",
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowBlur: 5,
                            borderWidth: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)"
                        }
                    }
                },
                series: [{
                    type: "map",
                    map: "china",
                    roam: false,
                    zoom: 1.23,
                    center: [105, 36],
                    // geoIndex: 1,
                    // aspectScale: 0.75, //长宽比
                    showLegendSymbol: false, // 存在legend时显示
                    label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            color: "#fff"
                        }
                    }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: "#0d0059",
                            borderColor: "#389dff",
                            borderWidth: 0.5
                        },
                        emphasis: {
                            areaColor: "#17008d",
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowBlur: 5,
                            borderWidth: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)"
                        }
                    }
                }]
            }
    
            echart.setOption(options)

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