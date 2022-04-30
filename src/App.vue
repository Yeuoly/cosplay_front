<template>
    <Header></Header>
    <bottom-nav></bottom-nav>
    <router-view></router-view>
</template>

<script>
import Header from './layout/Header.vue'
import BottomNav from './layout/BottomNav.vue'

export default {
  name: 'App',
  components: { Header, BottomNav }
}
</script>

<style>
body{
  margin: 0;
}
</style>