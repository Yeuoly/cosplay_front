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
        background-color: rgb(255,103,154);
    }
</style>