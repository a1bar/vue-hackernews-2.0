<template>
  <li class="news-item">
    <div class="img-container">
      <a :href="item.url" target="_blank" v-if="item.url"><img :src="imgUrl" :alt="item.title "></a>
    </div>
    <div class="meta-container">
      <span class="title">
        <template v-if="item.url">
          <a :href="item.url" target="_blank">{{ item.title }}</a>
          <span class="host"> ({{ item.url | host }})</span>
          <span class="score"> ({{ item.score }})</span>
          
        </template>
        <template v-else>
          <router-link :to="'/item/' + item.id">{{ item.title }}</router-link>
        </template>
      </span>
      <br>
      <span class="meta">
        <span v-if="item.type !== 'job'" class="by">
          by <router-link :to="'/user/' + item.by">{{ item.by }}</router-link>
        </span>
        <span class="time">
          {{ item.time | timeAgo }} ago
        </span>
        <span v-if="item.type !== 'job'" class="comments-link">
          | <router-link :to="'/item/' + item.id">{{ item.descendants }} comments</router-link>
        </span>
      </span>
      <span class="label" v-if="item.type !== 'story'">{{ item.type }}</span>
    </div>
  </li>
</template>

<script>
import { timeAgo } from '../filters'

export default {
  name: 'news-item',
  props: ['item'],
  computed: {
    imgUrl() {
      return `https://hnews.xyz/thumbnail/?width=500&height=500&screen=1024&format=jpg&url=${encodeURIComponent(this.item.url)}`;
    },
    thumbUrl() {
      return `https://hnews.xyz/thumbnail/?width=10&height=10&screen=1024&format=jpg&url=${encodeURIComponent(this.item.url)}`;
    },
  },
  // https://github.com/vuejs/vue/blob/next/packages/vue-server-renderer/README.md#component-caching
  serverCacheKey: props => {
    return `${
      props.item.id
    }::${
      props.item.__lastUpdated
    }::${
      timeAgo(props.item.time)
    }`
  }
}
</script>

<style lang="stylus">
.news-item
  background-color #fff
  padding 20px 30px
  border-bottom 1px solid #eee
  position relative
  line-height 20px
  .img-container
    width 500px
    height 500px
    img
      width 500px
      height 500px
      margin-bottom 50px
  .score
    color #ff6600
    font-size 0.8em
    text-align center
  .meta, .host
    font-size .85em
    color #999
    a
      color #999
      text-decoration underline
      &:hover
        color #ff6600
</style>
