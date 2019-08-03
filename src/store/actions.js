import * as actionTypes from './actions.type';
import * as mutationTypes from './mutations.type';

import categoryService from '../services/categoryService';
import favoriteThingService from '../services/favoriteThingService';

export default {
  async [actionTypes.FETCH_CATEGORIES]({ commit }) {
    const response = await categoryService.get();

    commit(mutationTypes.SET_CATEGORIES, response.data.results)
  },

  async [actionTypes.ADD_FAVORITE_THING]({ commit }, newFavoriteThing) {
    const response = await favoriteThingService.create(newFavoriteThing);

    commit(mutationTypes.ADD_FAVORITE_THING, response.data)
  },

  async [actionTypes.UPDATE_FAVORITE_THING]({ commit }, {
    favoriteThingId,
    updatedFavoriteThingData
  }) {
    const response = await favoriteThingService.update({
      favoriteThingId,
      updatedFavoriteThingData
    })

    commit(mutationTypes.UPDATE_FAVORITE_THING, response.data);
  },

  async [actionTypes.DELETE_FAVORITE_THING]({ commit }, { favoriteThingId }) {
    await favoriteThingService.delete({
      favoriteThingId
    });

    commit(mutationTypes.DELETE_FAVORITE_THING, favoriteThingId)
  },

  async [actionTypes.ADD_DUMMY_CATEGORY]({ commit }) {
    commit(mutationTypes.ADD_CATEGORY, {
      id: 'template',
      name: '',
      favorite_things: []
    })
  },

  async [actionTypes.DELETE_DUMMY_CATEGORY]({ commit }) {
    commit(mutationTypes.DELETE_CATEGORY, 'template')
  },

  async [actionTypes.ADD_CATEGORY]({ commit }, newCategory) {
    const response = await categoryService.create(newCategory)

    commit(mutationTypes.ADD_CATEGORY, response.data)
  },

  async [actionTypes.DELETE_CATEGORY]({ commit }, { categoryId }) {
    await categoryService.delete(categoryId);

    commit(mutationTypes.DELETE_CATEGORY, categoryId);
  }
}
