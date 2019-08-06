<template>
  <div class="text-gray-700">
    <h2 class="text-lg font-bold">
        <span v-if='editting'>
          <span>Edit </span>
          <span v-if="newFavoriteThing.title">{{newFavoriteThing.title}}</span>
          <span v-else>favorite thing</span>
        </span>
        <span v-else>
          Add new favorite <span class="lowercase">{{singularizedCategoryName}}</span>
        </span>
    </h2>
    <form class="mt-5" @submit.prevent="handleAddNewFavoriteThing">
      <div>
        <label class="font-bold">Title</label>
        <t-input
          v-model="$v.newFavoriteThing.title.$model"
          name="title"
          class="h-10 w-full"
          :status="!$v.newFavoriteThing.title.$dirty
            ? null
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
            null :
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
              ? null
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
      <AdditionalInformation
        @dataChange="handleMetadataChange"
        :currentMetadata="transformMetadata()"
        editting
      />
      <div class="mt-8 flex">
        <t-button
          :disabled="submitting"
          variant="primary"
          size="sm"
          class="mr-2 font-bold"
          type='submit'
          v-if="editting"
          @click.prevent="handleEditNewFavoriteThing"
        >
          <span v-if="submitting">
            <img src="../assets/spinner.svg" width="25">
          </span>
          <span v-else>
            Update<span class="lowercase">&nbsp;{{singularizedCategoryName}}</span>
          </span>
        </t-button>
        <t-button
          :disabled="submitting"
          variant="primary"
          size="sm"
          class="mr-2 font-bold"
          type='submit'
          v-else
        >
          <span v-if="submitting">
            <img src="../assets/spinner.svg" width="25">
          </span>
          <span v-else>
              Save favorite<span class="lowercase">&nbsp;{{singularizedCategoryName}}</span>
          </span>
        </t-button>

        <t-button size="sm" class="font-bold" @click="emitFinished">
          Cancel
        </t-button>
      </div>
    </form>
  </div>
</template>

<script>
// Vuex
import { mapActions } from 'vuex';
import * as actionTypes from '../store/actions.type';

import { required, minLength, maxLength } from 'vuelidate/lib/validators';

// components
import AdditionalInformation from './AdditionalInformation.vue';

export default {
  props: {
    category: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      default: false
    },
    singularizedCategoryName: {
      type: String,
      required: true
    },
    favoriteThing: {
      type: Object,
    },
    editting: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newFavoriteThing: this.getInitialNewFavoriteThing(),
      submitting: false,
    }
  },
  components: {
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
        metadata: []
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
        this.emitFinished();
      } finally {
        this.submitting = false;
      }
    },
    async handleEditNewFavoriteThing() {
      try{
        this.submitting = true;

        if(this.$v.newFavoriteThing.$invalid) {
          this.submitting = false;
          return this.$v.newFavoriteThing.$touch();
        }

        await this[actionTypes.UPDATE_FAVORITE_THING]({
          favoriteThingId: this.newFavoriteThing.id,
          updatedFavoriteThingData: this.newFavoriteThing
        });
        this.submitting = false;
        this.emitFinished();
      } finally {
        this.submitting = false;
      }
    },
    handleMetadataChange (value) {
      this.newFavoriteThing.metadata = value;
    },
    emitFinished() {
      this.$emit('finished');
      this.newFavoriteThing = this.getInitialNewFavoriteThing();
      this.$v.newFavoriteThing.$reset()
    },
    transformMetadata () {
      const metadata = typeof(this.newFavoriteThing.metadata) === 'object'
        ? this.newFavoriteThing.metadata
        : JSON.parse(this.newFavoriteThing.metadata);

      const transformedMetadata = metadata.map(data => {
        if (data.type === 'list' && Array.isArray(data.value)) {
          const updatedData = {
            ...data,
            value: [ ...data.value]
          }

          updatedData.value = updatedData.value.map(valueObject => {
            return {
              key: '',
              value: valueObject
            }
          });

          return updatedData;
        }

        return data;
      });

      return transformedMetadata;
    }
  },
  computed: {
    rankingInfo () {
      const currentRanking = Number(this.newFavoriteThing.ranking);
      
      if (currentRanking === 1) {
        return `Rank as favorite ${this.singularizedCategoryName}`
      }

      if (
        this.favoriteThing &&
        this.favoriteThing.ranking === currentRanking
      ) {
        return ''
      }

      if (
        currentRanking >= 1 &&
        currentRanking <= this.category.favorite_things.length
      ) {
          const newFavoriteThingInPostion = this.category.favorite_things[
            this.newFavoriteThing.ranking - 1
          ];

          return `Rank above ${newFavoriteThingInPostion.title}`
      }

      if (currentRanking === this.category.favorite_things.length + 1) {
        return `Rank as least favorite ${this.singularizedCategoryName}`
      }

      return '';
    },
  },

  mounted() {
    if (this.favoriteThing) {
      this.newFavoriteThing = this.favoriteThing;
    }
  }
}
</script>
