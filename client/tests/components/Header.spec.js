import { shallowMount } from '@vue/test-utils';
import Header from '../../src/components/Header.vue';

describe('Header component', () => {
  it('should match snapshot', () => {
    const wrapper = shallowMount(Header);

    expect(wrapper).toMatchSnapshot();
  });
});
