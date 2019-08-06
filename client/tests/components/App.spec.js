import { shallowMount, createLocalVue } from '@vue/test-utils';
import App from '../../src/App.vue';
import VueTailwind from 'vue-tailwind';
import Vuex from 'vuex';
import actions from '../../src/store/actions';
import * as actionTypes from '../../src/store/actions.type';

jest.mock('../../src/store/actions');

const localVue = createLocalVue();

localVue.use(VueTailwind);
localVue.use(Vuex);

let wrapper;

describe('App component', () => {
  beforeEach(() => {
    wrapper = shallowMount(App, {
      localVue,
      store: new Vuex.Store({
        actions
      }),
    });
  })
  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('addDummyCategory', () => {
    it('should call ADD_DUMMY_CATEGORY method', () => {
      wrapper.vm[actionTypes.ADD_DUMMY_CATEGORY] = jest.fn();

      wrapper.vm.addDummyCategory()

      expect(wrapper.vm[actionTypes.ADD_DUMMY_CATEGORY]).toBeCalled()
    })
  })

  it('should fetch categories on mount', () => {
    expect(actions[actionTypes.FETCH_CATEGORIES]).toBeCalled()
  })
})
