<template>
    <el-header class="nav-header">
        <el-menu mode="horizontal" style="background-color: transparent">
            <el-menu-item style="color: white">
                {{ GetUserName() }}
            </el-menu-item>
        </el-menu>
    </el-header>
</template>

<script>
import {  } from 'vue'
import { GetUserName } from '../store/user'

export default {
    setup() {
        return {
            GetUserName
        }
    }
}

</script>

<style>
    .nav-header {
        background-image: radial-gradient(circle at 0,#409eef,#3d59bb,#9cc,#61bbbb);
    }
</style>