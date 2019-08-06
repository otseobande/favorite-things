import { shallowMount } from '@vue/test-utils';
import Pencil from '../../src/components/Pencil.vue';

describe('Pencil component', () => {
  it('should match snapshot', () => {
    const wrapper = shallowMount(Pencil);

    expect(wrapper).toMatchSnapshot();
  });
});
