<template>
  <div class="min-h-2 max-h-full w-64 p-3 m-0 mr-4 bg-gray-500 rounded text-gray-100 font-bold">
    <h2 class="m-0 mb-3 ml-5 font-extrabold text-xl">Food</h2>
    <div class="flex">
      <div class="w-3 h-12 flex-col content-center justify-center" >
        <div
          class="h-full mt-2 align-middle"
          v-for="(favoriteThing, index) in favoriteThings"
          :key="favoriteThing.id">{{index + 1}}.</div>
      </div>
      <div class="w-10/12">
        <draggable
          v-model="favoriteThings"
          group="people"
          @start="drag=true"
          @end="drag=false"
          v-bind="dragOptions"
        >
          <transition-group type="transition" :name="!drag ? 'flip-list' : null">
            <FavoriteThing v-for="favoriteThing in favoriteThings" :key="favoriteThing.id" :favoriteThing="favoriteThing" />
          </transition-group>
        </draggable>
      </div>
    </div>

    <button class="outline-none mt-3 hover:bg-gray-600 cursor-pointer font-bold w-full px-2 py-1 rounded ">
      <img width="20" class="inline" src="../assets/add-icon-white.svg" />
      <span class="ml-2">Add favorite food</span>
      <!-- Icons made by https://www.flaticon.com/authors/hanan from https://www.flaticon.com/ -->
    </button>
  </div>
</template>

<script>
import FavoriteThing from './FavoriteThing.vue';
import draggable from 'vuedraggable';

export default {
  data() {
    return {
      favoriteThings: [
        {
          id: 1,
          name: 'Plantain'
        },
        {
          id: 2,
          name: 'Rice'
        },
        {
          id: 3,
          name: 'Beans'
        },
        {
          id: 4,
          name: 'Semo'
        }
      ],
      dragOptions: {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      },
      drag: false
    }
  },
  components: {
    FavoriteThing,
    draggable
  }
}
</script>

<style>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
