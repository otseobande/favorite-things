import { shallowMount, createLocalVue } from '@vue/test-utils';
import Category from '../../src/components/Category.vue';
import VueTailwind from 'vue-tailwind';
import Vuex from 'vuex';
import actions from '../../src/store/actions';
import * as actionTypes from '../../src/store/actions.type';
import toast from 'toast-me';

jest.mock('../../src/store/actions');
jest.mock('toast-me');
jest.useFakeTimers();

const localVue = createLocalVue();

localVue.use(VueTailwind);
localVue.use(Vuex);
const stubs = {
  't-input': {
    render() {},
    methods: {
      focus: jest.fn()
    }
  }
}
let wrapper;
const propsData = {
  category: {
    name: 'Test category',
    favorite_things: [
      {
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
      }
    ]
  },
}

describe('Category component', () => {
  beforeEach(() => {
    wrapper = shallowMount(Category, {
      localVue,
      store: new Vuex.Store({
        actions
      }),
      propsData,
      stubs
    });
  })
  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('handleFavoriteThingChange method', () => {
    it('should handle move event', () => {
      wrapper.vm[actionTypes.UPDATE_FAVORITE_THING] = jest.fn();

      const event = {
        moved: {
          newIndex: 1,
          element: {
            id: 1
          }
        }
      }

      wrapper.vm.handleFavoriteThingChange(event);

      expect(wrapper.vm[actionTypes.UPDATE_FAVORITE_THING]).toBeCalledWith({
        favoriteThingId: event.moved.element.id,
        updatedFavoriteThingData: {
          ranking: event.moved.newIndex + 1
        }
      })
    });

    it('should handle added event', () => {
      wrapper.vm[actionTypes.UPDATE_FAVORITE_THING] = jest.fn();

      const event = {
        added: {
          newIndex: 1,
          element: {
            id: 1
          }
        }
      }

      wrapper.vm.handleFavoriteThingChange(event);

      expect(wrapper.vm[actionTypes.UPDATE_FAVORITE_THING]).toBeCalledWith({
        favoriteThingId: event.added.element.id,
        updatedFavoriteThingData: {
          category: wrapper.vm.category.id,
          ranking: event.added.newIndex + 1,
        }
      })
    })
  });

  describe('handleCategoryNameClick method', () => {
    it('should set editting to true', () => {
      wrapper.vm.$refs.updateCategoryNameInput = {
        focus: jest.fn()
      }
      wrapper.vm.handleCategoryNameClick()

      expect(wrapper.vm.edittingCategoryName).toBeTruthy();
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100);

      setTimeout.mock.calls[0][0]()

      expect(stubs['t-input'].methods.focus).toBeCalled()
      stubs['t-input'].methods.focus.mockReset();
    })
  });

  describe('updateCategoryName', () => {
    it('should set edittingCategoryName to false', async () => {
      await wrapper.vm.updateCategoryName()

      expect(wrapper.vm.edittingCategoryName).toBe(false);
    });

    it('should update category if name is changed', async () => {
      wrapper.vm[actionTypes.UPDATE_CATEGORY] = jest.fn();
      wrapper.vm.updatedCategory = {
        name: 'Another name'
      }

      await wrapper.vm.updateCategoryName();

      expect(wrapper.vm[actionTypes.UPDATE_CATEGORY]).toBeCalledWith({
        categoryId: wrapper.vm.category.id,
        updatedCategoryData: {
          name: wrapper.vm.updatedCategory.name
        }
      });
      expect(wrapper.vm.edittingCategoryName).toBe(false);
    })
  });

  describe('handleNewCategoryInputBlur', () => {
    it('should call DELETE_DUMMY_CATEGORY if newCategoryName is empty', async () => {
      wrapper.vm[actionTypes.DELETE_DUMMY_CATEGORY] = jest.fn()

      wrapper.vm.handleNewCategoryInputBlur()

      expect(wrapper.vm[actionTypes.DELETE_DUMMY_CATEGORY]).toBeCalled()
    });

    it('should add new category if category name is set', async () => {
      wrapper.vm[actionTypes.DELETE_DUMMY_CATEGORY] = jest.fn();
      wrapper.vm[actionTypes.ADD_CATEGORY] = jest.fn();
      wrapper.vm.newCategoryName = 'new category';

      wrapper.vm.handleNewCategoryInputBlur()

      expect(wrapper.vm[actionTypes.ADD_CATEGORY]).toBeCalledWith({
        name: wrapper.vm.newCategoryName
      })
    })

    it('should toast error if add category returns error', async () => {
      wrapper.vm[actionTypes.DELETE_DUMMY_CATEGORY] = jest.fn();
      const error = {
        response: {
          status: 400,
          data: {
            name: ['Name is required']
          }
        }
      }

      wrapper.vm[actionTypes.ADD_CATEGORY] = jest.fn(() => {
        return Promise.reject(error)
      });
      wrapper.vm.newCategoryName = 'new category';

      await wrapper.vm.handleNewCategoryInputBlur()

      expect(toast).toBeCalledWith(error.response.data.name[0], 'error')
      toast.mockReset()
    })

    it('should not toast error if add category returns error not 400', async () => {
      wrapper.vm[actionTypes.DELETE_DUMMY_CATEGORY] = jest.fn();
      const error = {
        response: {
          status: 301,
        }
      }

      wrapper.vm[actionTypes.ADD_CATEGORY] = jest.fn(() => {
        return Promise.reject(error)
      });
      wrapper.vm.newCategoryName = 'new category';

      await wrapper.vm.handleNewCategoryInputBlur()

      expect(toast).not.toBeCalled()
      toast.mockReset()
    })
  })

  describe('showConfirmDeleteModal', () => {
    it('should show confirm delete modal', () => {
      wrapper.vm.$refs.categoryDeleteModal = {
        show: jest.fn()
      }

      wrapper.vm.showConfirmDeleteModal()

      expect(wrapper.vm.$refs.categoryDeleteModal.show).toBeCalled()
    })
  })

  describe('closeConfirmDeleteModal', () => {
    it('should close confirm delete modal', () => {
      wrapper.vm.$refs.categoryDeleteModal = {
        hide: jest.fn()
      }

      wrapper.vm.closeConfirmDeleteModal()

      expect(wrapper.vm.$refs.categoryDeleteModal.hide).toBeCalled()
    })
  })

  describe('deleteCategory', () => {
    it('should hide delete modal and call delete action', () => {
      wrapper.vm[actionTypes.DELETE_CATEGORY] = jest.fn();
      wrapper.vm.$refs.categoryDeleteModal = {
        hide: jest.fn()
      }

      wrapper.vm.deleteCategory()

      expect(wrapper.vm.$refs.categoryDeleteModal.hide).toBeCalled()
      expect(wrapper.vm[actionTypes.DELETE_CATEGORY]).toBeCalledWith({
        categoryId: wrapper.vm.category.id
      })
    })
  })

  describe('mounted', () => {
    it('should focus input', () => {
      wrapper = shallowMount(Category, {
        localVue,
        store: new Vuex.Store({
          actions
        }),
        propsData: {
          ...propsData,
          category: {
            ...propsData.category,
            name: ''
          }
        },
        stubs
      });

      expect(stubs['t-input'].methods.focus).toBeCalled()
    })
  })
});
