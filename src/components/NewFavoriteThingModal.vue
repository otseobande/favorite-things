<template>
  <t-modal
    ref="modal"
    closeIconClass="text-gray-300 w-8 right-0 mt-2 mr-6 absolute"
    @closed="$emit('close')"
  >
    <div class="text-gray-700">
      <h2 class="text-lg font-bold">
          Add new favorite <span class="lowercase">{{singularizedCategoryName}}</span>
      </h2>
      <form class="mt-5" @submit.prevent="handleAddNewFavoriteThing">
        <div>
          <label class="font-bold">Title</label>
          <t-input
            v-model="$v.newFavoriteThing.title.$model"
            name="title"
            class="h-10 w-full"
            :status="!$v.newFavoriteThing.title.$dirty
              ? 'default'
              : $v.newFavoriteThing.title.required && $v.newFavoriteThing.title.maxLength"
            :placeholder="`Enter favorite ${singularizedCategoryName} title`"
          />
          <div v-if="$v.newFavoriteThing.title.$dirty">
            <div
              v-if="!$v.newFavoriteThing.title.required"
              class="text-sm text-red-500"
            >
              Title is required
            </div>
            <div
              v-if="!$v.newFavoriteThing.title.maxLength"
              class="text-sm text-red-500"
            >
              Title should be less than 30 characters.
            </div>
          </div>
        </div>
        <div class="mt-2">
          <label class="font-bold">Description </label>
          <span class="text-sm italic text-gray-500">(optional)</span>
          <t-textarea
            v-model="$v.newFavoriteThing.description.$model"
            class="w-full"
            name="description"
            :status="!$v.newFavoriteThing.description.$dirty ?
              'default' :
              $v.newFavoriteThing.description.minLength"
            :placeholder="`Describe favorite ${singularizedCategoryName}`"
          />
          <div
            v-if="$v.newFavoriteThing.description.$dirty &&
              $v.newFavoriteThing.description.minLength === false"
            class="text-sm text-red-500"
          >
            Description should be greater than 10 characters.
          </div>
        </div>
        <div class="mt-2">
          <label class="font-bold">Ranking</label>
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
        <AdditionalInformation @dataChange="handleMetadataChange" />
        <div class="mt-8 flex">
          <t-button
            :disabled="submitting"
            variant="primary"
            size="sm"
            class="mr-2 font-bold"
            type='submit'
          >
            <span v-if="submitting">
              <img src="../assets/spinner.svg" width="25">
            </span>
            <span v-else>
              Save favorite<span class="lowercase">&nbsp;{{category.name}}</span>
            </span>
          </t-button>
          <t-button size="sm" class="font-bold" @click="closeModal">
            Cancel
          </t-button>
        </div>
      </form>
    </div>
  </t-modal>
</template>

<script>
// Vuex
import { mapActions } from 'vuex';
import * as actionTypes from '../store/actions.type';

import { required, minLength, maxLength } from 'vuelidate/lib/validators';

// components
import CloseIcon from './CloseIcon.vue';
import AdditionalInformation from './AdditionalInformation.vue';

export default {
  props: [
    'category',
    'show',
    'singularizedCategoryName',
  ],
  data() {
    return {
      newFavoriteThing: this.getInitialNewFavoriteThing(),
      submitting: false,
    }
  },
  components: {
    CloseIcon,
    AdditionalInformation
  },
  validations: {
    newFavoriteThing: {
      title: {
        required,
        maxLength: maxLength(30)
      },
      description: {
        minLength: minLength(4)
      },
      ranking: {
        required,
        betweenRanking: function(ranking) {
          return (
            ranking >= 1 &&
            ranking <= this.category.favorite_things.length + 1
          );
        }
      }
    }
  },
  methods: {
    ...mapActions([
      actionTypes.ADD_FAVORITE_THING,
      actionTypes.UPDATE_FAVORITE_THING,
    ]),
    getInitialNewFavoriteThing() {
      return {
        title: '',
        description: '',
        category: this.category.id,
        ranking: this.category.favorite_things.length + 1,
        metadata: ''
      }
    },
    async handleAddNewFavoriteThing() {
      try{
        this.submitting = true;

        if(this.$v.newFavoriteThing.$invalid) {
          this.submitting = false;
          return this.$v.newFavoriteThing.$touch();
        }

        await this[actionTypes.ADD_FAVORITE_THING](this.newFavoriteThing);
        this.submitting = false;
        this.closeModal();
      } finally {
        this.submitting = false;
      }
    },
    handleMetadataChange (value) {
      this.newFavoriteThing.metadata = value;
    },
    closeModal() {
      this.$refs.modal.hide();
      this.newFavoriteThing = this.getInitialNewFavoriteThing();
      this.$v.newFavoriteThing.$reset()
    },
  },
  computed: {
    rankingInfo () {
      if (Number(this.newFavoriteThing.ranking) === 1) {
        return `Favorite ${this.singularizedCategoryName}`
      }

      if (this.newFavoriteThing.ranking >= 1 &&
        this.newFavoriteThing.ranking <= this.category.favorite_things.length) {
          const newFavoriteThingInPostion = this.category.favorite_things[
            this.newFavoriteThing.ranking - 1
          ];

          return `Rank above ${newFavoriteThingInPostion.title}`
      }

      if (Number(this.newFavoriteThing.ranking) === this.category.favorite_things.length + 1) {
        return `Current least favorite ${this.singularizedCategoryName}`
      }

      return '';
    },
  },
  watch: {
    '$props.show': function (newValue, oldValue) {
      if (newValue) {
        this.$refs.modal.show();
      } else {
        this.closeModal();
      }
    }
  }
}
</script>
