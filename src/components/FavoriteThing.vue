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
      <span class="m-0 inline capitalize">
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
        <t-input
          name="title"
          class="h-10 w-full"
          v-if="editting.title"
          @blur="editting.title = false"
          ref='titleInput'
          autofocus
        />
        <h2 v-else class="text-2xl capitalize" @click="switchToInput">
          {{favoriteThing.title}}
        </h2>
        <small class="text-gray-600">in category {{categoryName}}</small>
        <div class="mt-4">
          <h3 class="text-lg">Description</h3>
          <p>
            <div v-if="favoriteThing.description" class="description">
              {{favoriteThing.description}}
            </div>
            <div v-else class="text-sm italic text-gray-500">
              Not provided
            </div>
          </p>
        </div>
        <div class="mt-3">
          <h3 class="text-lg">Ranking</h3>
          <p>
            {{rankingWithOrdinal}}
          </p>
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
    switchToInput() {
      this.editting.title = true;
      this.$refs.titleInput.focus()
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
    }
  }
}
</script>

<style>
.description::first-letter {
  text-transform: uppercase;
}
</style>
