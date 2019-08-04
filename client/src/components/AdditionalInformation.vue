<template>
  <div class="mt-4">
    <label class="font-bold">Additional information</label>
    <span class="text-sm italic text-gray-500 ml-1">(optional)</span>
    <div class="mt-1">
      <div class="flex">
        <div class="mr-1">
          <label class="text-sm mr-16">Type</label>
        </div>
        <div class="mr-1">
          <label class="text-sm mr-40">Key</label>
        </div>
        <div class="mr-1">
          <label class="text-sm ml-3">Value</label>
        </div>
      </div>
      <div class="flex mt-2" v-for="(data, index) in metadata" :key="index">
        <div class="mr-1">
          <t-select
            name="my-input"
            v-model="data.type"
            class="type-select text-sm"
            @change="handleInputTypeChange(index)"
            :options="[
              { value: 'text', text: 'Text' },
              { value: 'number', text: 'Number' },
              { value: 'date', text: 'Date' },
              { value: 'list', text: 'List' }
            ]"
          />
        </div>
        <div class="mr-1">
          <t-input class="h-10" v-model="data.label" @change="emitUpdate"/>
        </div>
        <div class="mr-1">
          <t-input
            class="h-10"
            v-model="data.value"
            @change="emitUpdate"
            :type="data.type"
            v-if="data.type !== 'list'"
          />
          <TagsInput
            v-else
            v-model="data.value"
            @tags-updated="emitUpdate"
            add-tags-on-comma
            add-tags-on-blur
            placeholder="Add item"
          />
        </div>
        <button class="text-red-500 px-1 h-8 w-8 mt-1" @click.prevent="removeField(index)">
          <CloseIcon class="fill-current w-4"/>
        </button>
      </div>
    </div>
    <t-button size="sm" class="text-sm mt-3" @click.prevent="addField">
      Add field
    </t-button>
  </div>
</template>

<script>
import CloseIcon from './CloseIcon.vue';
import TagsInput from '@voerro/vue-tagsinput';

export default {
  props: [
    'currentMetadata',
    'editting'
  ],
  components: {
    CloseIcon,
    TagsInput
  },
  data () {
    return {
      metadata: this.currentMetadata || [
        {
          type: 'text',
          label: '',
          value: ''
        }
      ],
    }
  },
  methods: {
    emitUpdate() {
      this.$emit('dataChange', this.cleanedMetadata);
    },
    handleInputTypeChange(index) {
      if (this.metadata[index].type === 'list') {
        this.metadata[index].value = []
      } else {
        this.metadata[index].value = ''
      }
      this.emitUpdate();
    },
    addField() {
      this.metadata.push({
        type: 'text',
        label: '',
        value: ''
      })
      this.emitUpdate();
    },
    removeField(index) {
      this.metadata.splice(index, 1);
      this.emitUpdate();
    },
  },
  computed: {
    cleanedMetadata () {
      return this.metadata
        .filter(data => {
          return Boolean(data.label) && Boolean(data.value);
        })
        .map(data => {
          if (data.type === 'list' && Array.isArray(data.value)) {
            const updatedData = { ...data, value: [ ...data.value ] };

            updatedData.value = updatedData.value.map(valueObject => {
              return valueObject.value;
            });

            return updatedData;
          }

          return data;
        });
    },
  },
  mounted() {
    if (this.currentMetadata) {
      this.metadata = this.currentMetadata;
    }
  }
}
</script>

<style>

.tags-input {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  max-width: 300px;
}

.tags-input input {
  flex: 1;
  background: transparent;
  border: none;
}

.tags-input input:focus {
  outline: none;
}

.tags-input input[type="text"] {
  color: #495057;
}

.tags-input-wrapper-default {
  padding: .5rem .25rem;

  background: #fff;

  border: 1px solid transparent;
  border-radius: .25rem;
  border-color: #dbdbdb;
}

/* The tag badges & the remove icon */
.tags-input span {
  margin-right: 0.3rem;
}

.tags-input-remove {
  cursor: pointer;
  position: relative;
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  overflow: hidden;
}

.tags-input-remove:before, .tags-input-remove:after {
  content: '';
  position: absolute;
  width: 100%;
  top: 50%;
  left: 0;
  background: #5dc282;

  height: 2px;
  margin-top: -1px;
}

.tags-input-remove:before {
    transform: rotate(45deg);
}
.tags-input-remove:after {
    transform: rotate(-45deg);
}

/* Tag badge styles */
.tags-input-badge {
    display: inline-block;
    padding: 0.25em 0.4em;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25rem;
}

.tags-input-badge-pill {
    padding-right: 0.6em;
    padding-left: 0.6em;
    border-radius: 10rem;
}

.tags-input-badge-selected-default {
    color: #212529;
    background-color: #f0f1f2;
}

/* Typeahead */
.typeahead-hide-btn {
    color: #999 !important;
    font-style: italic;
}

/* Typeahead - badges */
.typeahead-badges > span {
    cursor: pointer;
    margin-right: 0.3rem;
}

/* Typeahead - dropdown */
.typeahead-dropdown {
    list-style-type: none;
    padding: 0;
    margin: 0;
    position: absolute;
    width: 100%;
    z-index: 1000;
}

.typeahead-dropdown li {
    padding: .25rem 1rem;
    cursor: pointer;
}

/* Typeahead elements style/theme */
.tags-input-typeahead-item-default {
    color: #fff;
    background-color: #343a40;
}

.tags-input-typeahead-item-highlighted-default {
    color: #fff;
    background-color: #007bff;
}
</style>
