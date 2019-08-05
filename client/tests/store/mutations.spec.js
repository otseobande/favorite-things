import mutations from '../../src/store/mutations';
import * as mutationTypes from '../../src/store/mutations.type';

describe('Vuex mutations', () => {
  describe('SET_CATEGORIES mutation', () => {
    it('should set categories to state', () => {
      const state = {};
      const categories = [{
        name: 'Test categories'
      }];

      mutations[mutationTypes.SET_CATEGORIES](state, categories);

      expect(state.categories[0]).toEqual(categories[0])
    })
  }),

  describe('ADD_FAVORITE_THING mutation', () => {
    it('should add favorite thing to category in state', () => {
      const state = {
        categories: [
          {
            id: 1,
            name: 'Test Category',
            favorite_things: []
          }
        ]
      };
      const favoriteThing = {
        title: 'Test favorite thing',
        ranking: 1,
        category: 1
      }

      mutations[mutationTypes.ADD_FAVORITE_THING](state, favoriteThing);

      expect(state.categories[0].favorite_things[0]).toEqual(favoriteThing)
    })
  }),
  describe('UPDATE_FAVORITE_THING mutation', () => {
    const state = {
      categories: [
        {
          id: 1,
          name: 'Test Category',
          favorite_things: [
            {
              id: 1,
              title: 'Test favorite thing',
              ranking: 1,
              category: 1
            }
          ]
        }
      ]
    };

    const updatedFavoriteThing = {
      id: 1,
      title: 'Updated title',
      ranking: 1,
      category: 1
    }

    mutations[mutationTypes.UPDATE_FAVORITE_THING](state, updatedFavoriteThing);

    expect(state.categories[0].favorite_things[0]).toEqual(updatedFavoriteThing)
  })
});
