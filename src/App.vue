<template>
  <div id="app">
    <div class="pl-32">
      <Header />
      <div class="flex pt-10">
        <Category />
        <Category />
        <div class="h-12 max-h-full w-64 p-3 m-0 mr-4 bg-gray-500 hover:bg-gray-600 rounded text-white font-bold cursor-pointer outline-none">
          <button>
            <img width="20" class="inline mr-3" src="./assets/add-icon-white.svg" />
            <span>Add new category</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Category from './components/Category.vue'

export default {
  name: 'app',
  components: {
    Header,
    Category
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
  background: linear-gradient(90deg, #4b6cb7 0%, #182848 100%);
}
</style>
