<template>
  <div>
    <div
      :class="`
        w-full
        mt-2
        bg-white
        rounded
        text-gray-700
        p-3
        cursor-pointer
        hover:shadow-2xl
        hover:bg-gray-200
        flex
        flex-row
        justify-between
      `"
      @click="openDetailsModal"
    >
      <span class="m-0 inline capitalize font-bold">
        {{index + 1}}. {{favoriteThing.title}}
      </span>
      <button @click.stop.prevent="confirmDelete" class="p-1 text-center">
        <img src="../assets/cancel.svg" width="10" />
      </button>
    </div>
    <t-modal
      ref="detailsModal"
      closeIconClass="text-gray-300 w-8 right-0 mt-2 mr-6 absolute"
    >
      <div class="text-gray-700 flex flex-col">
        <h2 class="text-2xl capitalize font-bold">
          {{favoriteThing.title}} <button class="ml-3"><Pencil class="h-4 w-4 inline"/></button>
        </h2>

        <small class="text-gray-600">in category {{categoryName}}</small>
        <div class="mt-4">
          <h3 class="text-lg font-bold">Description</h3>
          <div>
            <div v-if="favoriteThing.description" class="description">
              {{favoriteThing.description}}
            </div>
            <div v-else class="text-sm italic text-gray-500">
              Not provided
            </div>
          </div>
        </div>
        <div class="mt-3">
          <h3 class="text-lg font-bold">Ranking</h3>
          <p>
            {{rankingWithOrdinal}}
          </p>
        </div>
        <div v-if="metadata">
          <div class="mt-3" v-for="(data, index) in metadata" :key="index">
            <h3 class="text-lg font-bold">{{data.label}}</h3>
            <p v-if="Array.isArray(data.value)">
              <ul class="list-disc pl-8">
                <li v-for="(value, index) in data.value" :key="index">
                  {{value}}
                </li>
              </ul>
            </p>
            <p v-else>
              {{data.value}}
            </p>
          </div>
        </div>
      </div>
    </t-modal>
    <t-modal ref="deleteModal" closeIconClass="text-gray-300 w-8 right-0 mt-2 mr-6 absolute">
      <div class="text-gray-700">
        <h2 class="text-lg mt-16 text-center">
          Add you sure you want to delete {{favoriteThing.title}}?
        </h2>
        <div class="mt-6 flex justify-center">
          <div>
            <t-button
              variant="danger"
              size="sm"
              class="mr-2 font-bold"
              type='submit'
              @click="deleteFavoriteThing"
            >
              Delete
            </t-button>
            <t-button size="sm" class="font-bold" @click="closeConfirmDeleteModal">
              Cancel
            </t-button>
          </div>
        </div>
      </div>
    </t-modal>
  </div>
</template>

<script>
// Vuex
import { mapActions } from 'vuex';
import * as actionTypes from '../store/actions.type';

import toast from 'toast-me';

import getNumberWithOrdinal from '../utils/getNumberWithOrdinal';

// components
import Pencil from './Pencil.vue';

export default {
  props: [
    'favoriteThing',
    'index',
    'categoryName'
  ],
  data() {
    return {
      showConfirmDeleteModal: false,
      editting: {
        title: false,
        description: false,
        ranking: false
      }
    }
  },
  components: {
    Pencil
  },
  methods: {
    ...mapActions([
      actionTypes.DELETE_FAVORITE_THING
    ]),
    confirmDelete() {
      this.$refs.deleteModal.show()
    },
    closeConfirmDeleteModal() {
      this.$refs.deleteModal.hide()
    },
    openDetailsModal() {
      this.$refs.detailsModal.show()
    },
    closeDetailsModal() {
      this.$refs.detailsModal.hide()
    },
    async deleteFavoriteThing(){
      this.closeConfirmDeleteModal();
      await this[actionTypes.DELETE_FAVORITE_THING]({
        favoriteThingId: this.favoriteThing.id
      });

      toast('Favorite thing deleted successfully!');
    }
  },
  computed: {
    rankingWithOrdinal () {
      return getNumberWithOrdinal(this.favoriteThing.ranking)
    },
    metadata () {
      if (typeof(this.favoriteThing.metadata) === 'object') {
        return this.favoriteThing.metadata;
      }

      return JSON.parse(this.favoriteThing.metadata);
    }
  }
}
</script>

<style>
.description::first-letter {
  text-transform: uppercase;
}
</style>
