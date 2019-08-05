import { mount } from '@vue/test-utils';
import Spinner from '../../src/components/Spinner.vue';

describe('Spinner component', () => {
  it('should match snapshot', () => {
    const wrapper = mount(Spinner);

    expect(wrapper).toMatchSnapshot();
  });
});
