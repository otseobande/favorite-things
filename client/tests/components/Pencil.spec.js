import { mount } from '@vue/test-utils';
import Pencil from '../../src/components/Pencil.vue';

describe('Pencil component', () => {
  it('should match snapshot', () => {
    const wrapper = mount(Pencil);

    expect(wrapper).toMatchSnapshot();
  });
});
