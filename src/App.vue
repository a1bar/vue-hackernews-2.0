<template>
  <div id="app">
    <top-navigation></top-navigation>
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>
<script>
import TopNavigation from './components/TopNavigation.vue'
export default {
  components: { TopNavigation }
}
</script>
<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-size: 15px;
  background-color: #f2f3f5;
  margin: 0;
  padding-top: 55px;
  color: #34495e;
  overflow-y: scroll;
}
a {
  color: #34495e;
  text-decoration: none;
}

.view {
  margin: 0 auto;
  position: relative;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
@media (max-width: 860px) {
  .header .inner {
    padding: 15px 30px;
  }
}
@media (max-width: 600px) {
  body {
    font-size: 14px;
  }
  .header .inner {
    padding: 15px;
  }
  .header a {
    margin-right: 1em;
  }
  .header .github {
    display: none;
  }
}
</style>
