import { shallowMount, createLocalVue } from '@vue/test-utils';
import AdditionalInformation from '../../src/components/AdditionalInformation.vue';
import VueTailwind from 'vue-tailwind';
import Vuex from 'vuex';
import actions from '../../src/store/actions';
import Vuelidate from 'vuelidate';
import * as actionTypes from '../../src/store/actions.type';

jest.mock('../../src/store/actions');

const localVue = createLocalVue();

localVue.use(VueTailwind);
localVue.use(Vuex);
localVue.use(Vuelidate);

let wrapper;
const propsData = {
  category: {
    name: 'Test category',
    favorite_things: []
  },
  singularizedCategoryName: 'Test category'
}

describe('AdditionalInformation component', () => {
  beforeEach(() => {
    wrapper = shallowMount(AdditionalInformation, {
      localVue,
      store: new Vuex.Store({
        actions
      }),
      propsData,
    });
  })
  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('emitUpdate method', () => {
    it('should emit dataChange event', () => {
      wrapper.vm.$emit = jest.fn()

      wrapper.vm.emitUpdate()

      expect(wrapper.vm.$emit).toBeCalledWith(
        'dataChange',
        wrapper.vm.cleanedMetadata
      );
    })
  });

  describe('handleInputTypeChange', () => {
    it('should reset metadata value for index if not list to string', () => {
      wrapper.vm.emitUpdate = jest.fn()
      wrapper.vm.handleInputTypeChange(0);

      expect(wrapper.vm.metadata[0].value).toEqual('');
      expect(wrapper.vm.emitUpdate).toBeCalled()
    });
    it('should reset metadata value for index if type is list to an array', () => {
      wrapper.vm.metadata = [
        {
          type: 'list',
          label: '',
          value: ''
        }
      ]
      wrapper.vm.emitUpdate = jest.fn()
      wrapper.vm.handleInputTypeChange(0);

      expect(wrapper.vm.metadata[0].value).toEqual([]);
      expect(wrapper.vm.emitUpdate).toBeCalled()
    });
  });

  describe('addField method', () => {
    it('should push new metadata field', () => {
      expect(wrapper.vm.metadata.length).toEqual(1)

      wrapper.vm.addField()

      expect(wrapper.vm.metadata.length).toEqual(2)
    });
    it('should emit update', () => {
      wrapper.vm.emitUpdate = jest.fn()
      wrapper.vm.addField()
      expect(wrapper.vm.emitUpdate).toBeCalled()
    })
  })

  describe('removeField method', () => {
    it('should push new metadata field', () => {
      expect(wrapper.vm.metadata.length).toEqual(1)

      wrapper.vm.removeField()

      expect(wrapper.vm.metadata.length).toEqual(0)
    });
    it('should emit update', () => {
      wrapper.vm.emitUpdate = jest.fn()
      wrapper.vm.removeField()
      expect(wrapper.vm.emitUpdate).toBeCalled()
    })
  });

  describe('cleanMetaData computed field', () => {
    it('should flatten list fields', () => {
      wrapper.vm.metadata = [
        {
          type: 'text',
          label: 'name',
          value: 'Otse'
        },
        {
          type: 'list',
          label: 'hobbies',
          value: [
            {
              key: '',
              value: 'coding'
            },
            {
              key: '',
              value: 'coding'
            }
          ]
        }
      ]

      expect(wrapper.vm.cleanedMetadata).toEqual(
        [
          {
            type: 'text',
            label: 'name',
            value: 'Otse'
          },
          {
            type: 'list',
            label: 'hobbies',
            value: ['coding', 'coding']
          }
        ]
      )
    })
  });

  it('should map currentMetadata prop to metadata state', () => {
    wrapper = shallowMount(AdditionalInformation, {
      localVue,
      store: new Vuex.Store({
        actions
      }),
      propsData: {
        ...propsData,
        currentMetadata: []
      },
    });

    expect(wrapper.vm.metadata).toEqual([])
  })
})
