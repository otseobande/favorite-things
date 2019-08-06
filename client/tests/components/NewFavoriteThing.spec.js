import { shallowMount, createLocalVue } from '@vue/test-utils';
import NewFavoriteThing from '../../src/components/NewFavoriteThing.vue';
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

describe('NewFavoriteThing component', () => {
  beforeEach(() => {
    wrapper = shallowMount(NewFavoriteThing, {
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

  describe('handleAddNewFavoriteThing method', () => {
    it('should validate form and touch all fields if form is invalid', async () => {
      wrapper.vm[actionTypes.ADD_FAVORITE_THING] = jest.fn();
      await wrapper.vm.handleAddNewFavoriteThing()

      expect(wrapper.vm.submitting).toBe(false);
      expect(wrapper.vm[actionTypes.ADD_FAVORITE_THING]).not.toBeCalled()
    })

    it('should call add favorite thing action if form is valid', async () => {
      const newFavoriteThing = {
        id: 1,
        title: 'test',
        ranking: 1,
        category: 1,
        metadata: []
      }
      wrapper.vm.newFavoriteThing = newFavoriteThing
      wrapper.vm[actionTypes.ADD_FAVORITE_THING] = jest.fn();
      await wrapper.vm.handleAddNewFavoriteThing();

      expect(wrapper.vm[actionTypes.ADD_FAVORITE_THING]).toBeCalledWith(newFavoriteThing);
    })
  })

  describe('handleEditNewFavoriteThing method', () => {
    it('should validate form and touch all fields if form is invalid', async () => {
      wrapper.vm[actionTypes.UPDATE_FAVORITE_THING] = jest.fn();
      await wrapper.vm.handleEditNewFavoriteThing()

      expect(wrapper.vm.submitting).toBe(false);
      expect(wrapper.vm[actionTypes.UPDATE_FAVORITE_THING]).not.toBeCalled()
    })

    it('should call add favorite thing action if form is valid', async () => {
      const newFavoriteThing = {
        id: 1,
        title: 'test',
        ranking: 1,
        category: 1,
        metadata: []
      }
      wrapper.vm.newFavoriteThing = newFavoriteThing
      wrapper.vm[actionTypes.UPDATE_FAVORITE_THING] = jest.fn();
      await wrapper.vm.handleEditNewFavoriteThing();

      expect(wrapper.vm[actionTypes.UPDATE_FAVORITE_THING]).toBeCalledWith({
        favoriteThingId: newFavoriteThing.id,
        updatedFavoriteThingData: newFavoriteThing
      });
    });
  });

  describe('handleMetadataChange', () => {
    it('should update new favorite thing metadta', () => {
      const updatedMetadata = [{ name: 'update' }];
      wrapper.vm.handleMetadataChange(updatedMetadata);

      expect(wrapper.vm.newFavoriteThing.metadata).toEqual(updatedMetadata);
    })
  });

  describe('transformMetadata', () => {
    it('should convert vue tag input to flat array if metadata is an array', () => {
      wrapper.vm.newFavoriteThing.metadata = [
        {
          type: 'list',
          label: 'sports',
          value: ['Basketball']
        }
      ]
      expect(wrapper.vm.transformMetadata()).toEqual([
        {
          type: 'list',
          label: 'sports',
          value: [{
            key: '',
            value: 'Basketball'
          }]
        }
      ])
    })

    it('should convert vue tag input to flat array if metadata is a string', () => {
      wrapper.vm.newFavoriteThing.metadata = JSON.stringify([
        {
          type: 'list',
          label: 'sports',
          value: ['Basketball']
        }
      ]);

      expect(wrapper.vm.transformMetadata()).toEqual([
        {
          type: 'list',
          label: 'sports',
          value: [{
            key: '',
            value: 'Basketball'
          }]
        }
      ])
    })
  })

  describe('rankingInfo computed field', () => {
    it('should return empty string if rank is currentrank', () => {
      wrapper.vm.newFavoriteThing.ranking = 3
      wrapper.setProps({
        favoriteThing: {
          ranking: wrapper.vm.newFavoriteThing.ranking
        }
      });

      expect(wrapper.vm.rankingInfo).toEqual('');
    });
    it('should return rank above if current ranking is in the middle', () => {
      wrapper.setProps({
        category: {
          ...propsData.category,
          favorite_things: [
            {
              title: 'test',
              ranking: 1
            },
            {
              title: 'second test',
              ranking: 2
            },
            {
              title: 'third test',
              ranking: 3
            }
          ]
        }
      });

      wrapper.vm.newFavoriteThing.ranking = 2;

      expect(wrapper.vm.rankingInfo).toEqual('Rank above second test')
    })
    it('should return rank as least if current ranking is the least', () => {
      wrapper.setProps({
        category: {
          ...propsData.category,
          favorite_things: [
            {
              title: 'test',
              ranking: 1
            },
            {
              title: 'second test',
              ranking: 2
            },
            {
              title: 'third test',
              ranking: 3
            }
          ]
        }
      });

      wrapper.vm.newFavoriteThing.ranking = 4;

      expect(wrapper.vm.rankingInfo).toEqual('Rank as least favorite Test category');
    })
  });

  it('should set newFavoriteThing to favoriteThing if passed as props on mount', () => {
    wrapper = shallowMount(NewFavoriteThing, {
      localVue,
      store: new Vuex.Store({
        actions
      }),
      propsData: {
        ...propsData,
        favoriteThing: {
          title: 'test',
          ranking: 1,
          metadata: []
        },
      },
    });

    expect(wrapper.vm.newFavoriteThing).toEqual(wrapper.vm.favoriteThing)
  })
});
