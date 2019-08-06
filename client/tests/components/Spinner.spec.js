import { shallowMount } from '@vue/test-utils';
import Spinner from '../../src/components/Spinner.vue';

describe('Spinner component', () => {
  it('should match snapshot', () => {
    const wrapper = shallowMount(Spinner);

    expect(wrapper).toMatchSnapshot();
  });
});
