<template>
  <div class="news-view" :key="type">
    <spinner :show="loading"></spinner>
    <div class="news-list" v-if="displayedPage > 0 && displayedItems.length">
      <transition-group tag="ul" name="item">
        <item v-for="item in displayedItems" :key="item.id" :item="item">
        </item>
      </transition-group>
      <infinite-loading :on-infinite="loadItems" :next-page="page" :distance="750"></infinite-loading>
    </div>
  </div>
</template>

<script>
import Spinner from './Spinner.vue'
import Item from './Item.vue'
import { watchList } from '../store/api'
import InfiniteLoading from './InfiniteLoading.vue'

let isInitialRender = true

export default {
  name: 'item-list',

  components: {
    Spinner,
    Item,
    InfiniteLoading,
  },

  props: {
    type: String
  },

  data () {
    const data = {
      loading: false,
      transition: 'slide-up',
      // if this is the initial render, directly render with the store state
      // otherwise this is a page switch, start with blank and wait for data load.
      // we need these local state so that we can precisely control the timing
      // of the transitions.
      displayedPage: isInitialRender ? Number(this.$store.state.route.params.page) || 1 : -1,
      displayedItems: isInitialRender ? this.$store.getters.activeItems : []
    }
    isInitialRender = false
    return data
  },

  computed: {
    page () {
      return this.$store.state.activePage[this.type] || Number(this.$store.state.route.params.page) || 1
    },
    maxPage () {
      const { itemsPerPage, lists } = this.$store.state
      return Math.ceil(lists[this.type].length / itemsPerPage)
    },
    hasMore () {
      return this.page < this.maxPage
    }
  },

  beforeMount () {
    if (this.$root._isMounted) {
      this.loadItems(this.page)
    }
    // watch the current list for realtime updates
    this.unwatchList = watchList(this.type, ids => {
      this.$store.commit('SET_LIST', { type: this.type, ids })
      this.$store.dispatch('ENSURE_ACTIVE_ITEMS').then(() => {
        this.displayedItems = this.$store.getters.activeItems
      })
    })
  },
  beforeDestroy () {
    this.unwatchList()
  },

  // watch: {
  //   page (to, from) {
  //     this.loadItems(to, from)
  //   }
  // },

  methods: {
    fake(page){
      return new Promise((resolve,reject) => {
        console.log('Firing fake')
        setTimeout(function () {
          console.log('Resolving Fake Scroll',page);
          resolve(page);
        }.bind(this), 1000);
      });
    },
    loadItems (to = this.page, from = -1) {
      this.loading = true
      // debugger;
      return this.$store.dispatch('FETCH_LIST_DATA', {
        type: this.type,
        page: to
      }).then((result) => {
        if (!this.hasMore) { return Promise.reject('We have reached teh end of the list');}
        if (this.page < 0 || this.page > this.maxPage) {
          this.$router.replace(`/${this.type}/1`)
          return
        }
        // this.transition = from === -1
        //   ? null
        //   : to > from ? 'slide-left' : 'slide-right'
        this.displayedPage = to
        this.displayedItems = this.$store.getters.activeItems
        this.loading = false
        // this.$router.replace({ path: `/${this.type}/${this.page+1}`, hash: 'infinite' });
        if (this.$store.getters.scrollPosition) {
          const x=this.$store.getters.scrollPosition.x;
          const y=this.$store.getters.scrollPosition.y;
          console.log(this.$store.getters.scrollPosition);
          this.$nextTick(function () {
          window.scroll(x,y);
          this.$store.commit('SET_SCROLL', {
              type: this.type,
              scrollPosition: null
            });
          });
        }
        return result;
      })
    }
  }
}
</script>

<style scoped>
.news-view {
  padding-top: 20px;
}
.news-list-nav {
  background-color: #fff;
  border-radius: 2px;
}
.news-list {
  width: 100%;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.news-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-content: center;
}
.news-list ul li {
  flex: 0 1 450px;
  min-width: 1px;
  margin: 10px;
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(30px, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-30px, 0);
}
.item-move,
.item-enter-active,
.item-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.item-enter {
  opacity: 0;
  transform: translate(30px, 0);
}
.item-leave-active {
  position: absolute;
  opacity: 0;
  transform: translate(30px, 0);
}
@media (max-width: 768px) {
  .news-list {
    margin: 10px 0;
  }
  .news-list ul li {
    flex: 0 1 350px;
    margin: 5px;
  }
}
</style>
