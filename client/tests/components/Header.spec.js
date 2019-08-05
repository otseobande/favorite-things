import { mount } from '@vue/test-utils';
import Header from '../../src/components/Header.vue';

describe('Header component', () => {
  it('should match snapshot', () => {
    const wrapper = mount(Header);

    expect(wrapper).toMatchSnapshot();
  });
});
