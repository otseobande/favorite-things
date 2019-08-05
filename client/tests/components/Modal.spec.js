import { mount, shallowMount, createLocalVue} from '@vue/test-utils';
import Modal from '../src/components/Modal.vue';
import VueTailwind from 'vue-tailwind';

const localVue = createLocalVue()
localVue.use(VueTailwind);

describe('Modal component', () => {
  it('should match snapshot', () => {
    const wrapper = shallowMount(Modal, {
      localVue
    });

    expect(wrapper).toMatchSnapshot();
  });
  it('should match snapshot if show is true', () => {
    const wrapper = mount(Modal, {
      localVue
    });

    wrapper.setProps({ show: true });

    expect(wrapper).toMatchSnapshot();
  });

  it('should match snapshot if show is false', () => {
    const wrapper = mount(Modal, {
      localVue,
      propsData: {
        show: true
      }
    });

    wrapper.setProps({ show: false });

    expect(wrapper).toMatchSnapshot();
  });
});
