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
  });

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
    });

    it('should reposition other favorite things if position is taken', () => {
      const state = {
        categories: [
          {
            id: 1,
            name: 'Test Category',
            favorite_things: [
              {
                title: 'Test favorite thing',
                ranking: 1,
                category: 1
              },
              {
                title: 'Second favorite thing',
                ranking: 2,
                category: 1
              },
              {
                title: 'Third favorite thing',
                ranking: 3,
                category: 1
              }
            ]
          },
          {
            id: 2,
            name: 'Second Category',
            favorite_things: []
          },
        ]
      };
      const favoriteThing = {
        title: 'New favorite thing',
        ranking: 2,
        category: 1
      }

      mutations[mutationTypes.ADD_FAVORITE_THING](state, favoriteThing);

      expect(state.categories[0].favorite_things[3].ranking).toEqual(3)
    })
  });

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
            },
            {
              id: 2,
              title: 'Another favorite thing',
              ranking: 1,
              category: 1
            }
          ]
        },
        {
          id: 2,
          name: 'Second Category',
          favorite_things: []
        },
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
  });

  describe('DELETE_FAVORITE_THING mutation', () => {
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

    mutations[mutationTypes.DELETE_FAVORITE_THING](state, 1);

    expect(state.categories[0].favorite_things).toHaveLength(0);
  });

  describe('DELETE_CATEGORY mutation', () => {
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

    mutations[mutationTypes.DELETE_CATEGORY](state, 1);

    expect(state.categories).toHaveLength(0);
  });

  describe('ADD_CATEGORY mutation', () => {
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

    const newCategory = {
      id: 2,
      name: 'New Category',
      favorite_things: [
        {
          id: 1,
          title: 'Test favorite thing',
          ranking: 1,
          category: 2
        }
      ]
    }

    mutations[mutationTypes.ADD_CATEGORY](state, newCategory);

    expect(state.categories[1]).toEqual(newCategory);
  });

  describe('UPDATE_CATEGORY mutation', () => {
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
        },
        {
          id: 2,
          name: 'Another Category',
          favorite_things: []
        }
      ]
    };
    const updatedCategory = {
      id: 1,
      name: 'Updated Category',
      favorite_things: [
        {
          id: 1,
          title: 'Test favorite thing',
          ranking: 1,
          category: 1
        },
      ]
    }

    mutations[mutationTypes.UPDATE_CATEGORY](state, updatedCategory);

    expect(state.categories.find(category => {
      return category.id == updatedCategory.id
    })).toEqual(updatedCategory);
  });
});
