<template>
    <el-card class="cos-point-card">
        <el-image
            :src="cover"
        ></el-image>
        <div class="cos-point-card-info">
            <div class="cos-point-card-status">
                <el-tag size="mini" type="info" v-if="isCommited && !isRejected && !isRejected">
                    已提交
                </el-tag>
                <el-tag size="mini" type="warning" v-if="isRejected">
                    审核失败
                </el-tag>
                <el-tag size="mini" type="success" v-if="isResolved">
                    正常
                </el-tag>
            </div>
            <div class="cos-point-card-title">
                {{ name }}
            </div>
            <div class="cos-point-card-location">
                地点：{{ location }}
            </div>
            <div class="cos-point-card-description">
                简介：{{ description }}
            </div>
        </div>
    </el-card>
</template>

<script>
import { computed } from 'vue-demi'

export default {
    props: {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        cover: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        status: {
            type: Number,
            required: true
        },
        location: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const isCommited = computed(() => {
            return (props.status & 1) === 1
        })
        const isResolved = computed(() => {
            return (props.status & ( 0x1 << 1 )) === ( 0x1 << 1 )
        })
        const isRejected = computed(() => {
            return (props.status & ( 0x1 << 2 )) === ( 0x1 << 2 )
        })
        const isPublic = computed(() => {
            return (props.status & ( 0x1 << 3 )) === ( 0x1 << 3 )
        })

        return {
            isCommited,
            isResolved,
            isRejected,
            isPublic
        }
    }
}
</script>

<style>
.cos-point-card {
    width: 100%;
    position: relative;
    margin-bottom: 10px;
}

.cos-point-card-status {
    position: absolute;
    top: 15px;
    right: 0;
}

.cos-point-card-info {
    position: relative;
    padding-top: 14px;
}

.cos-point-card-title {
    font-size: 18px;
    font-weight: bold;
    width: calc(100% - 100px);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}   

.cos-point-card-description {
    padding-top: 7px;
    font-size: 14px;
}

.cos-point-card-location {
    padding-top: 7px;
    font-size: 14px;
}
</style>