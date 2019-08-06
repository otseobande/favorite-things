import { shallowMount } from '@vue/test-utils';
import CloseIcon from '../../src/components/CloseIcon.vue';

describe('CloseIcon component', () => {
  it('should match snapshot', () => {
    const wrapper = shallowMount(CloseIcon);

    expect(wrapper).toMatchSnapshot();
  });
});
