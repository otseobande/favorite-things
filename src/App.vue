<template>
  <div id="app">
    <div class="pl-24">
      <Header />
      <div v-if="fetchingCategories" class="flex flex-col justify-center items-center">
        <Spinner />
        <p class="text-gray-100">Fetching your favorite things!</p>
      </div>
      <div v-else class="flex flex-row items-start pt-10 mb-10 pr-10">
        <Category v-for="category in categories" :key="category.id" :category="category" />
        <div :class="`
          h-12
          max-h-full
          w-64
          p-3
          m-0
          mr-10
          bg-gray-500
          hover:bg-gray-600
          rounded
          text-white
          font-bold
          cursor-pointer
          outline-none
          category`">
          <button @click="addDummyCategory">
            <img width="20" class="inline mr-3" src="./assets/add-icon-white.svg" />
            <span class="font-bold">Add new category</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Category from './components/Category.vue';
import Spinner from './components/Spinner.vue';

import { mapActions, mapState } from 'vuex';
import * as actionTypes from './store/actions.type';

export default {
  name: 'app',
  components: {
    Header,
    Category,
    Spinner
  },
  data() {
    return {
      fetchingCategories: false
    }
  },
  methods: {
    ...mapActions([
      actionTypes.FETCH_CATEGORIES,
      actionTypes.ADD_DUMMY_CATEGORY
    ]),
    addDummyCategory() {
      this[actionTypes.ADD_DUMMY_CATEGORY]()
    }
  },
  computed: {
    ...mapState([
      'categories'
    ])
  },
  async mounted() {
    try{
      this.fetchingCategories = true;

      this[actionTypes.FETCH_CATEGORIES]();

      this.fetchingCategories = false;
    } catch (error) {
      this.fetchingCategories = false;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

}

html, body {
  height: 100%;
  background: #4b6cb7;
}
</style>
