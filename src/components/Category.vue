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
    font-bold
    category`"
  >
    <div :class="`
      sticky
      bg-gray-500
      pt-4
      px-4
      top-0
      m-0
      mb-3
      font-extrabold
      text-xl
      capitalize
      category-title`"
    >
      <div v-if="category.name" class="flex justify-between">
        <span>{{category.name}}</span>
        <button class="p-2" @click="showConfirmDeleteModal">
          <CloseIcon class="fill-current w-4" />
        </button>
      </div>
      <t-input
        v-else
        v-model="newCategoryName"
        class="h-8 bg-transparent border-white text-gray-800 w-full text-sm"
        placeholder="Enter new category name"
        @blur="handleNewCategoryInputBlur"
        @keyup.enter="$event.target.blur()"
        autofocus
      />
    </div>
      <div class="w-full px-2">
        <draggable
          v-model.trim="category.favorite_things"
          group="people"
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
            />
          </transition-group>
        </draggable>
      </div>
    <!-- </div> -->

    <div v-if="category.name" class="bg-gray-500 sticky bottom-0">
      <button
        class="bottom-0 outline-none mt-3 p-3 py-3 hover:bg-gray-600 cursor-pointer font-bold w-full px-2 py-1 rounded"
        @click="$refs.modal.show()"
      >
        <img width="20" class="inline" src="../assets/add-icon-white.svg" />
        <span class="ml-2">
          Add favorite <span class="lowercase">{{category.name}}</span>
        </span>
        <!-- Icons made by https://www.flaticon.com/authors/hanan from https://www.flaticon.com/ -->
      </button>
    </div>
    <t-modal ref="modal" closeIconClass="text-gray-300 w-8 right-0 mt-2 mr-6 absolute">
      <div class="text-gray-700">
        <h2 class="text-lg">
           Add new favorite <span class="lowercase">{{category.name}}</span>
        </h2>
        <form class="mt-5" @submit.prevent="handleAddFavoriteThing">
          <div>
            <label>Title <span class="text-red-500">*</span></label>
            <t-input
              v-model="$v.newFavoriteThing.title.$model"
              name="title"
              class="h-10 w-full"
              :status="!$v.newFavoriteThing.title.$dirty
                ? 'default'
                : $v.newFavoriteThing.title.required"
              :placeholder="`Enter favorite ${category.name} title`"
            />
            <span
              v-if="$v.newFavoriteThing.title.$dirty && !$v.newFavoriteThing.title.required"
              class="text-sm text-red-500"
            >
              Title is required
            </span>
          </div>
          <div class="mt-2">
            <label>Description</label>
            <t-textarea
             v-model="$v.newFavoriteThing.description.$model"
              class="w-full"
              name="description"
              :status="$v.newFavoriteThing.description.$dirty || 'default'"
              :placeholder="`Describe favorite ${category.name}`"
            />
          </div>
          <div class="mt-2">
            <label>Ranking <span class="text-red-500">*</span></label>
            <div>
              <t-input
                v-model="$v.newFavoriteThing.ranking.$model"
                class="h-10 mr-0 inline"
                name="ranking"
                type="number"
                min="1"
                :max="`${this.category.favorite_things.length + 1}`"
                :status="!$v.newFavoriteThing.ranking.$dirty
                  ? 'default'
                  : (
                    $v.newFavoriteThing.ranking.required &&
                    $v.newFavoriteThing.ranking.betweenRanking
                  )"
              />
              <small class="ml-2 capitalize">{{rankingInfo}}</small>
            </div>
            <div v-if="$v.newFavoriteThing.ranking.$dirty">
              <div
                v-if="!$v.newFavoriteThing.ranking.required"
                class="text-sm text-red-500"
              >
                Ranking is required
              </div>
              <div
                v-if="!$v.newFavoriteThing.ranking.betweenRanking"
                class="text-sm text-red-500"
              >
                Ranking is out of range
              </div>
            </div>
          </div>
          <div class="mt-6 flex">
            <t-button
              :disabled="submittingAddFavoriteThingForm"
              variant="primary"
              size="sm"
              class="mr-2 font-bold"
              type='submit'
            >
              <span v-if="submittingAddFavoriteThingForm">
                <img src="../assets/spinner.svg" width="25">
              </span>
              <span v-else>
                Add favorite<span class="lowercase">&nbsp;{{category.name}}</span>
              </span>
            </t-button>
            <t-button size="sm" class="font-bold" @click="closeModal">
              Cancel
            </t-button>
          </div>
        </form>
      </div>
    </t-modal>
    <t-modal ref="categoryDeleteModal" closeIconClass="text-gray-300 w-8 right-0 mt-2 mr-6 absolute" class="h-30">
      <div class="text-gray-700">
        <div class="text-lg mt-16 text-center">
           <h2>Add you sure you want to delete {{category.name}}?</h2>
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
import { required } from 'vuelidate/lib/validators';

// components
import FavoriteThing from './FavoriteThing.vue';
import CloseIcon from './CloseIcon.vue';

export default {
  props: ['category'],
  data() {
    return {
      showModal: false,
      newFavoriteThing: this.getInitialNewFavoriteThing(),
      dragOptions: {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      },
      drag: false,
      submittingAddFavoriteThingForm: false,
      newCategoryName: ''
    }
  },
  validations: {
    newFavoriteThing: {
      title: {
        required,
      },
      description: {

      },
      ranking: {
        required,
        betweenRanking: function(ranking) {
          return (
            ranking >= 1 &&
            ranking <= this.category.favorite_things.length + 1);
        }
      }
    }
  },
  methods: {
    ...mapActions([
      actionTypes.ADD_FAVORITE_THING,
      actionTypes.UPDATE_FAVORITE_THING,
      actionTypes.DELETE_DUMMY_CATEGORY,
      actionTypes.ADD_CATEGORY,
      actionTypes.DELETE_CATEGORY
    ]),
    async handleAddFavoriteThing() {
      this.submittingAddFavoriteThingForm = true;
      if(this.$v.newFavoriteThing.$invalid) {
        this.submittingAddFavoriteThingForm = false;
        return this.$v.newFavoriteThing.$touch();
      }

      await this[actionTypes.ADD_FAVORITE_THING](this.newFavoriteThing);
      this.submittingAddFavoriteThingForm = false;
      this.closeModal();
    },
    handleFavoriteThingChange(event) {
      if(event.moved) {
        this[actionTypes.UPDATE_FAVORITE_THING]({
          favoriteThingId: event.moved.element.id,
          updatedFavoriteThingData: {
            ranking: event.moved.newIndex + 1
          }
        })
      }
    },
    async handleNewCategoryInputBlur() {
      if(this.newCategoryName) {
        await this[actionTypes.ADD_CATEGORY]({
          name: this.newCategoryName
        });
        this[actionTypes.DELETE_DUMMY_CATEGORY]()
      } else {
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
    getInitialNewFavoriteThing() {
      return {
        title: '',
        description: '',
        category: this.category.id,
        ranking: this.category.favorite_things.length + 1
      }
    },
    closeModal() {
      this.$refs.modal.hide();
      this.newFavoriteThing = this.getInitialNewFavoriteThing();
      this.$v.newFavoriteThing.$reset()
    }
  },
  computed: {
    rankingInfo () {
      if (this.newFavoriteThing.ranking === 1) {
        return 'Favorite'
      }

      if (this.newFavoriteThing.ranking >= 1 &&
        this.newFavoriteThing.ranking <= this.category.favorite_things.length) {
          const favoriteThingInPostion = this.category.favorite_things[
            this.newFavoriteThing.ranking - 1];

          return `Rank above ${favoriteThingInPostion.title}`
      }

      if (this.newFavoriteThing.ranking === this.category.favorite_things.length + 1) {
        return 'Least favorite'
      }

      return '';
    }
  },
  components: {
    FavoriteThing,
    draggable,
    CloseIcon
  }
}
</script>

<style>
.category{
  max-height: 85vh;
  min-width: 262px;
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
