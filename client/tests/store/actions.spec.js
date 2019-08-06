import actions from '../../src/store/actions';
import * as actionTypes from '../../src/store/actions.type';
import * as mutationTypes from '../../src/store/mutations.type';

import categoryService from '../../src/services/categoryService';
import favoriteThingService from '../../src/services/favoriteThingService';

jest.mock('../../src/services/categoryService');
jest.mock('../../src/services/favoriteThingService');

describe('Vuex actions', () => {
  describe('FETCH_CATEGORIES action', () => {
    it('should commit SET_CATEGORIES mutation', async () => {
      const commit = jest.fn();
      const response = {
        data: {
          results: [{ id: 1 }]
        }
      }
      categoryService.get.mockImplementation(() => Promise.resolve(response));

      await actions[actionTypes.FETCH_CATEGORIES]({ commit });

      expect(commit).toBeCalledWith(
        mutationTypes.SET_CATEGORIES,
        response.data.results
      );
      expect(categoryService.get).toBeCalled()
    })
  });

  describe('ADD_FAVORITE_THING action', () => {
    it('should commit ADD_FAVORITE_THING mutation', async () => {
      const commit = jest.fn();
      const response = {
        data: {
           id: 1
        }
      }

      favoriteThingService.create.mockImplementation(() => {
        return Promise.resolve(response)
      });

      const newFavoriteThing = {
        title: 'Favorite thing'
      }

      await actions[actionTypes.ADD_FAVORITE_THING](
        { commit },
        newFavoriteThing
      );

      expect(favoriteThingService.create).toBeCalledWith(newFavoriteThing);
      expect(commit).toBeCalledWith(
        mutationTypes.ADD_FAVORITE_THING,
        response.data
      )
    });
  });

  describe('UPDATE_FAVORITE_THING action', () => {
    it('should commit UPDATE_FAVORITE_THING mutation', async () => {
      const commit = jest.fn();
      const response = {
        data: {
           id: 1
        }
      }

      favoriteThingService.update.mockImplementation(() => {
        return Promise.resolve(response)
      });

      const updatedFavoriteThingData = {
        title: 'Favorite thing'
      }
      const favoriteThingId = 1;

      await actions[actionTypes.UPDATE_FAVORITE_THING](
        { commit },
        {
          favoriteThingId,
          updatedFavoriteThingData
        }
      );

      expect(favoriteThingService.update).toBeCalledWith({
        favoriteThingId,
        updatedFavoriteThingData
      });

      expect(commit).toBeCalledWith(
        mutationTypes.UPDATE_FAVORITE_THING,
        response.data
      )
    });
  });

  describe('DELETE_FAVORITE_THING action', () => {
    it('should commit DELETE_FAVORITE_THING mutation', async () => {
      const commit = jest.fn();
      const response = {
        data: {
           id: 1
        }
      }

      favoriteThingService.delete.mockImplementation(() => {
        return Promise.resolve(response)
      });

      const favoriteThingId = 1;

      await actions[actionTypes.DELETE_FAVORITE_THING](
        { commit },
        {
          favoriteThingId
        }
      );

      expect(favoriteThingService.delete).toBeCalledWith({
        favoriteThingId
      });

      expect(commit).toBeCalledWith(
        mutationTypes.DELETE_FAVORITE_THING,
        favoriteThingId
      )
    });
  });

  describe('ADD_DUMMY_CATEGORY action', () => {
    it('should commit ADD_CATEGORY mutation', async () => {
      const commit = jest.fn();
      const dummyCategory = {
        id: 'template',
        name: '',
        favorite_things: []
      };

      await actions[actionTypes.ADD_DUMMY_CATEGORY](
        { commit },
        dummyCategory
      );

      expect(commit).toBeCalledWith(
        mutationTypes.ADD_CATEGORY,
        dummyCategory
      )
    });
  });

  describe('DELETE_DUMMY_CATEGORY action', () => {
    it('should commit DELETE_CATEGORY mutation', async () => {
      const commit = jest.fn();

      await actions[actionTypes.DELETE_DUMMY_CATEGORY]({ commit });

      expect(commit).toBeCalledWith(
        mutationTypes.DELETE_CATEGORY,
        'template'
      )
    });
  });

  describe('ADD_CATEGORY action', () => {
    it('should commit ADD_CATEGORY mutation', async () => {
      const commit = jest.fn();
      const response = {
        data: {
          results: [{ id: 1 }]
        }
      }

      categoryService.create.mockImplementation(() => {
        return Promise.resolve(response)
      });

      const newCategory = {
        name: 'Basketball teams'
      }

      await actions[actionTypes.ADD_CATEGORY]({ commit }, newCategory);

      expect(categoryService.create).toBeCalledWith(newCategory);

      expect(commit).toBeCalledWith(
        mutationTypes.ADD_CATEGORY,
        response.data
      )
    });
  });

  describe('DELETE_CATEGORY action', () => {
    it('should commit DELETE_CATEGORY mutation', async () => {
      const commit = jest.fn();
      const categoryId = 1;

      await actions[actionTypes.DELETE_CATEGORY]({ commit }, { categoryId });

      expect(categoryService.delete).toBeCalledWith(categoryId);

      expect(commit).toBeCalledWith(
        mutationTypes.DELETE_CATEGORY,
        categoryId
      )
    });
  });

  describe('UPDATE_CATEGORY action', () => {
    it('should commit UDPATE_CATEGORY mutation', async () => {
      const commit = jest.fn();
      const categoryId = 1;
      const updatedCategoryData = {
        name: 'Basketball teams'
      }
      const response = {
        data: {
          results: [{ id: 1 }]
        }
      }

      categoryService.update.mockImplementation(() => {
        return Promise.resolve(response)
      });


      await actions[actionTypes.UPDATE_CATEGORY](
        { commit },
        {
          categoryId,
          updatedCategoryData
        });

      expect(categoryService.update).toBeCalledWith({
        categoryId,
        updatedCategoryData
      });

      expect(commit).toBeCalledWith(
        mutationTypes.UPDATE_CATEGORY,
        response.data
      )
    })
  })
})
