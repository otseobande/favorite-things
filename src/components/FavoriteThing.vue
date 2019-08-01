<template>
  <div class='w-full ml-2 mt-2 bg-white rounded shadow-md text-gray-700 p-3 cursor-pointer hover:shadow-xl'>
    <h3 class="m-0 mb-3 inline">{{favoriteThing.name}}</h3>
  </div>
</template>

<script>
export default {
  props: ['favoriteThing']
}
</script>
