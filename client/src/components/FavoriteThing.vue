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
      @closed="editting = false"
    >
      <div v-if="editting">
        <NewFavoriteThing
          :category="category"
          :favoriteThing="favoriteThing"
          :singularizedCategoryName="singularizedCategoryName"
          :editting='editting'
          @finished="editting = false"
        />
      </div>
      <div v-else class="text-gray-700 flex flex-col">
        <div class="text-2xl capitalize font-bold flex items-center" @click="editting = true">
          <span class="">{{favoriteThing.title}}</span>
          <button class="ml-3 border rounded text-sm px-1 text-gray-700 hover:bg-gray-200 flex items-center">
            <span>Edit</span>
            <Pencil class="h-3 w-3 ml-1 inline fill-current"/>
          </button>
        </div>

        <small class="text-gray-600">in category {{category.name}}</small>
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
        <div class="flex flex-col mt-3 text-sm">
          <t-button size="sm" @click="viewActivities = !viewActivities">
            <span v-if="viewActivities">Close activities</span>
            <span v-else>View activities</span>
          </t-button>
          <template v-if="viewActivities">
            <div
              class="mt-2 border-b"
              v-for="event in updateHistory"
              :key="event.timestamp"
            >
              <p>{{getChangesString(event.changes)}}</p>
              <p class="italic text-gray-600 mt-1">on {{formatDate(event.timestamp)}}</p>
            </div>
          </template>
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
import format from 'date-fns/format';

// components
import Pencil from './Pencil.vue';
import NewFavoriteThing from './NewFavoriteThing.vue'

export default {
  props: {
    favoriteThing: {
      required: true,
      type: Object
    },
    index: {
      required: true,
      type: Number
    },
    category: {
      required: true,
      type: Object
    },
    singularizedCategoryName: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      showConfirmDeleteModal: false,
      editting: false,
      viewActivities: false
    }
  },
  components: {
    Pencil,
    NewFavoriteThing
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
      this.$refs.detailsModal.hide();
      this.editting = false;
    },
    async deleteFavoriteThing(){
      this.closeConfirmDeleteModal();
      await this[actionTypes.DELETE_FAVORITE_THING]({
        favoriteThingId: this.favoriteThing.id
      });

      toast('Favorite thing deleted successfully!');
    },
    getChangesString(changes) {
      const parsedChanges = JSON.parse(changes);

      const changesString = Object.keys(parsedChanges).reduce((acc, key, index, arr) => {
        const change = parsedChanges[key];
        let seperator = '';

        if (index < arr.length - 2) {
          seperator = ', ';
        }

        if (index === arr.length - 2) {
          seperator = ' and ';
        }

        if (index === arr.length - 1) {
          seperator = '.'
        }

        return `${acc}${key} from ${change[0]} to ${change[1]}${seperator}`
      }, 'Changed ');

      return changesString;
    },
    formatDate(date) {
      return format(new Date(date), 'Do MMM, YYYY. h:mma')
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
    },
    updateHistory () {
      return this.favoriteThing.history.filter(event => {
        return event.action === 1;
      })
    }
  }
}
</script>

<style>
.description::first-letter {
  text-transform: uppercase;
}
</style>
