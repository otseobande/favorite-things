import { mount } from '@vue/test-utils';
import CloseIcon from '../src/components/CloseIcon.vue';

describe('CloseIcon component', () => {
  it('should match snapshot', () => {
    const wrapper = mount(CloseIcon);

    expect(wrapper).toMatchSnapshot();
  });
});
