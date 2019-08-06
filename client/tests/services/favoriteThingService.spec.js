import http from '../../src/services/http';
import favoriteThingService from '../../src/services/favoriteThingService';

jest.mock('../../src/services/http');

describe('Favorite thing Service', () => {
  const resourceEndpoint = '/favorite-things/';

  describe('create method', () => {
    it('should call http post method', () => {
      const favoriteThingData = {
        name: 'Test category'
      }

      favoriteThingService.create(favoriteThingData)

      expect(http.post).toBeCalledWith(resourceEndpoint, favoriteThingData)
    })
  });

  describe('update method', () => {
    it('should call http patch method', () => {
      const favoriteThingId = 1;
      const updatedFavoriteThingData = {
        title: 'Test favorite thing'
      };

      favoriteThingService.update({ favoriteThingId, updatedFavoriteThingData });

      expect(http.patch).toBeCalledWith(
        `${resourceEndpoint}${favoriteThingId}/`,
        updatedFavoriteThingData
      )
    })
  });

  describe('delete method', () => {
    it('should call http delete method', () => {
      const favoriteThingId = 1;

      favoriteThingService.delete({ favoriteThingId });

      expect(http.delete).toBeCalledWith(
        `${resourceEndpoint}${favoriteThingId}/`
      )
    })
  })
});
