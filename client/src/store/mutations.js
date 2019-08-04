import * as mutationTypes from './mutations.type';

export default {
  [mutationTypes.SET_CATEGORIES](state, categories) {
    state.categories = categories;
  },

  [mutationTypes.ADD_FAVORITE_THING](state, favoriteThing) {
    state.categories = state.categories.map(category => {
      if (category.id === favoriteThing.category) {
        const updatedCategory = { ...category };
        const newfavoriteThingIndex = favoriteThing.ranking - 1;

        if (newfavoriteThingIndex === updatedCategory.favorite_things.length) {
          updatedCategory.favorite_things[newfavoriteThingIndex] = favoriteThing;
        } else {
          updatedCategory.favorite_things.splice(newfavoriteThingIndex, 0, favoriteThing);
        }

        return updatedCategory;
      }

      return category;
    })
  },

  [mutationTypes.UPDATE_FAVORITE_THING](state, updatedFavoriteThing) {
    state.categories = state.categories.map(category => {
      if (category.id === updatedFavoriteThing.category) {
        const updatedCategory = { ...category };

        updatedCategory.favorite_things = updatedCategory
          .favorite_things
          .map(favoriteThing => {
            if (favoriteThing.id === updatedFavoriteThing.id) {
              return updatedFavoriteThing;
            }

            return favoriteThing;
          })

        return updatedCategory;
      }
      return category;
    })
  },

  [mutationTypes.DELETE_FAVORITE_THING](state, favoriteThingId) {
    state.categories = state.categories.map(category => {
      const updatedCategory = { ...category };

      updatedCategory.favorite_things = updatedCategory
        .favorite_things
        .filter(favoriteThing => favoriteThing.id !== favoriteThingId);

      return updatedCategory;
    });
  },

  [mutationTypes.DELETE_CATEGORY](state, categoryId) {
    state.categories = state.categories.filter(category => {
      return category.id !== categoryId;
    })
  },

  [mutationTypes.ADD_CATEGORY](state, newCategory) {
    state.categories = [
      ...state.categories,
      newCategory
    ]
  },

  [mutationTypes.UPDATE_CATEGORY](state, updatedCategory) {
    state.categories = state.categories.map(category => {
      if (category.id === updatedCategory.id) {
        return updatedCategory;
      }

      return category;
    })
  }
}
