<template>
  <div :class="`
    max-h-screen
    min-h-10
    overflow-auto
    m-0
    mr-4
    bg-gray-500
    rounded
    text-gray-100
    category`"
  >
    <div :class="`
      sticky
      bg-gray-500
      pt-4
      pl-4
      pr-3
      top-0
      m-0
      mb-3
      font-extrabold
      text-xl
      capitalize
      category-title`"
    >
      <div v-if="category.name" class="flex justify-between">
        <t-input
          v-if="edittingCategoryName"
          v-model="updatedCategory.name"
          class="h-8 bg-white border-white text-gray-800 w-full text-sm"
          @blur="updateCategoryName"
          @keyup.enter="$event.target.blur()"
          ref="updateCategoryNameInput"
          autofocus
        />
        <span
          v-else
          @click="handleCategoryNameClick"
        >
          {{category.name}}
        </span>

        <button class="p-2" @click="showConfirmDeleteModal">
          <CloseIcon class="fill-current w-4" />
        </button>
      </div>
      <div v-else>
        <label class="text-sm">Category name</label>
        <t-input
          v-model="newCategoryName"
          class="h-8 bg-white border-white text-gray-800 w-full text-sm"
          placeholder="Enter new category name"
          @blur="handleNewCategoryInputBlur"
          @keyup.enter="$event.target.blur()"
          ref="newCategoryInput"
          autofocus
        />
      </div>
    </div>
      <div class="w-full px-2">
        <draggable
          :list="category.favorite_things"
          group="categories"
          @start="drag=true"
          @end="drag=false"
          @change="handleFavoriteThingChange"
          v-bind="dragOptions"
        >
          <transition-group type="transition" :name="!drag ? 'flip-list' : null">
            <FavoriteThing
              v-for="(favoriteThing, index) in category.favorite_things"
              :key="favoriteThing.id"
              :favoriteThing="favoriteThing"
              :index="index"
              :categoryName="category.name"
              :category="category"
              :singularizedCategoryName="singularizedCategoryName"
            />
          </transition-group>
        </draggable>
      </div>
    <!-- </div> -->

    <div v-if="category.name" class="bg-gray-500 sticky bottom-0">
      <button
        class="bottom-0 outline-none mt-3 p-3 py-3 hover:bg-gray-600 cursor-pointer font-bold w-full px-2 py-1 rounded"
        @click="showNewFavoriteThingModal = true"
      >
        <img width="20" class="inline" src="../assets/add-icon-white.svg" />
        <span class="ml-2 font-bold">
          Add favorite <span class="lowercase">{{singularizedCategoryName}}</span>
        </span>
        <!-- Icons made by https://www.flaticon.com/authors/hanan from https://www.flaticon.com/ -->
      </button>
    </div>
    <Modal
      :show="showNewFavoriteThingModal"
      @close="showNewFavoriteThingModal = false"
    >
      <NewFavoriteThing
        :category="category"
        :singularizedCategoryName="singularizedCategoryName"
        @finished="showNewFavoriteThingModal = false"
      />
    </Modal>
    <t-modal ref="categoryDeleteModal" closeIconClass="text-gray-300 w-8 right-0 mt-2 mr-6 absolute" class="h-30">
      <div class="text-gray-700">
        <div class="text-lg mt-16 text-center">
           <h2 class="font-bold mb-4">Add you sure you want to delete {{category.name}}?</h2>
           <p>Deleting a category would delete all the favorite items in that category.</p>
        </div>
        <div class="mt-6 flex justify-center">
          <div>
            <t-button
              variant="danger"
              size="sm"
              class="mr-2 font-bold"
              type='submit'
              @click="deleteCategory"
            >
              <span>
                Delete
              </span>
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

import draggable from 'vuedraggable';
import Tense from 'tense';
import toast from 'toast-me';

// components
import FavoriteThing from './FavoriteThing.vue';
import NewFavoriteThing from './NewFavoriteThing.vue';
import Modal from './Modal.vue';
import CloseIcon from './CloseIcon.vue'

export default {
  props: ['category'],
  components: {
    FavoriteThing,
    draggable,
    NewFavoriteThing,
    Modal,
    CloseIcon
  },
  data() {
    return {
      showModal: false,
      showNewFavoriteThingModal: false,
      newFavoriteThing: {},
      dragOptions: {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      },
      drag: false,
      newCategoryName: '',
      updatedCategory: {
        name: this.category.name
      },
      edittingCategoryName: false
    }
  },
  methods: {
    ...mapActions([
      actionTypes.DELETE_DUMMY_CATEGORY,
      actionTypes.UPDATE_FAVORITE_THING,
      actionTypes.UPDATE_CATEGORY,
      actionTypes.ADD_CATEGORY,
      actionTypes.DELETE_CATEGORY
    ]),
    handleFavoriteThingChange(event) {
      if(event.moved) {
        this[actionTypes.UPDATE_FAVORITE_THING]({
          favoriteThingId: event.moved.element.id,
          updatedFavoriteThingData: {
            ranking: event.moved.newIndex + 1
          }
        })
      }

      if (event.added) {
        this[actionTypes.UPDATE_FAVORITE_THING]({
          favoriteThingId: event.added.element.id,
          updatedFavoriteThingData: {
            ranking: event.added.newIndex + 1,
            category: this.category.id
          }
        })
      }
    },
    handleCategoryNameClick () {
      this.edittingCategoryName = true;
      setTimeout(() => this.$refs.updateCategoryNameInput.focus(), 100);
    },
    async updateCategoryName() {
      if (this.category.name !== this.updatedCategory.name) {
        await this[actionTypes.UPDATE_CATEGORY]({
          categoryId: this.category.id,
          updatedCategoryData: {
            name: this.updatedCategory.name
          }
        });
      }

      this.edittingCategoryName = false;
    },
    async handleNewCategoryInputBlur() {
      try{
        if(this.newCategoryName) {
          await this[actionTypes.ADD_CATEGORY]({
            name: this.newCategoryName
          });
        }
      } catch (error) {
        if (error.response.status === 400) {
          if (error.response.data.name) {
            toast(error.response.data.name[0], 'error');
          }
        }
      } finally {
        this[actionTypes.DELETE_DUMMY_CATEGORY]();
      }
    },
    showConfirmDeleteModal() {
      this.$refs.categoryDeleteModal.show();
    },
    closeConfirmDeleteModal() {
      this.$refs.categoryDeleteModal.hide()
    },
    deleteCategory() {
      this.$refs.categoryDeleteModal.hide();
      return this[actionTypes.DELETE_CATEGORY]({
        categoryId: this.category.id
      });
    },
  },
  computed: {
    singularizedCategoryName() {
      const tense = new Tense()
      return tense.singularize(this.category.name)
    }
  },
  mounted() {
    if(this.$refs.newCategoryInput) {
      this.$refs.newCategoryInput.focus()
    }
  }
}
</script>

<style>
.category{
  max-height: 85vh;
  min-width: 262px;
}

.type-select > select {
  height: 2.5rem;
}
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
