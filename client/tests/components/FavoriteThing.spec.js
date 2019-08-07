import { shallowMount, createLocalVue } from '@vue/test-utils';
import FavoriteThing from '../../src/components/FavoriteThing.vue';
import VueTailwind from 'vue-tailwind';
import Vuex from 'vuex';
import actions from '../../src/store/actions';
import * as actionTypes from '../../src/store/actions.type';
import toast from 'toast-me';
import format from 'date-fns/format';

jest.mock('../../src/store/actions');
jest.mock('date-fns/format');

const localVue = createLocalVue();

localVue.use(VueTailwind);
localVue.use(Vuex);

let wrapper;
const propsData = {
  favoriteThing: {
    title: 'Test thing',
    ranking: 1,
    category: 1,
    metadata: [],
    history: [
      {
        action: 1,
        changes: {
          'name': ['People', 'Places'],
          'title': ['food', 'sport'],
          'job': ['cleaner', 'software developer']
         }
      },
      {
        action: 2,
        changes: {
          'name': ['People', 'Places'],
          'title': ['food', 'sport'],
          'job': ['cleaner', 'software developer']
         }
      }
    ]
  },
  index: 0,
  category: {
    name: 'Test category'
  },
  singularizedCategoryName: 'Test category'
}

describe('FavoriteThing component', () => {
  beforeEach(() => {
    wrapper = shallowMount(FavoriteThing, {
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

  describe('confirmDelete method', () => {
    it('should show delete modal on call', () => {
      wrapper.vm.$refs.deleteModal = {
        show: jest.fn()
      };

      wrapper.vm.confirmDelete();

      expect(wrapper.vm.$refs.deleteModal.show).toBeCalled();
    })
  });

  describe('closeConfirmDeleteModal', () => {
    it('should close confirm delete modal', () => {
      wrapper.vm.$refs.deleteModal = {
        hide: jest.fn()
      };

      wrapper.vm.closeConfirmDeleteModal();

      expect(wrapper.vm.$refs.deleteModal.hide).toBeCalled();
    })
  });

  describe('openDetailsModal', () => {
    it('should open the details modal', () => {
      wrapper.vm.$refs.detailsModal = {
        show: jest.fn()
      };

      wrapper.vm.openDetailsModal();

      expect(wrapper.vm.$refs.detailsModal.show).toBeCalled();
    })
  });

  describe('closeDetailsModal', () => {
    it('should close the details modal', () => {
      wrapper.vm.$refs.detailsModal = {
        hide: jest.fn()
      };

      wrapper.vm.closeDetailsModal();

      expect(wrapper.vm.$refs.detailsModal.hide).toBeCalled();
      expect(wrapper.vm.editting).toEqual(false);
    });
  });

  describe('deleteFavoriteThing', () => {
    it('should close confirmDeleteModal and call action method', async () => {
      wrapper.vm.closeConfirmDeleteModal = jest.fn();
      wrapper.vm[actionTypes.DELETE_FAVORITE_THING] = jest.fn();

      await wrapper.vm.deleteFavoriteThing();
      expect(wrapper.vm[actionTypes.DELETE_FAVORITE_THING]).toBeCalledWith(
        {
          favoriteThingId: wrapper.vm.favoriteThing.id
        }
      )
      expect(toast).toBeCalledWith('Favorite thing deleted successfully!');
      toast.mockReset()
    });
  });

  describe('getChangesString', () => {
    it('should parse changes json string to a human readable string', async () => {
      const changes = {
        'name': ['People', 'Places'],
        'title': ['food', 'sport'],
        'job': ['cleaner', 'software developer']
       };

      const changesString = wrapper.vm.getChangesString(JSON.stringify(changes));

      expect(changesString).toEqual('Changed name from People to Places, title from food to sport and job from cleaner to software developer.')
    });
  });

  describe('formatDate method', () => {
    it('should use datefns to format date', () => {
      wrapper.vm.formatDate('2018-09-09');

      expect(format).toBeCalledWith(new Date('2018-09-09'), 'Do MMM, YYYY. h:mma')
    })
  });

  describe('updateHistory computed field', () => {
    it('should return events with action 1', () => {
      expect(wrapper.vm.updateHistory.every(event => {
        return event.action == 1;
      })).toBeTruthy();
    })
  })

  describe('metadata computed field', () => {
    it('should return parsed metadata', () => {
      wrapper.setProps({
        favoriteThing: {
          ...propsData.favoriteThing,
          metadata: '[]'
        }
      })
      expect(wrapper.vm.metadata).toEqual([]);
    })
  })
});
