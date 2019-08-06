import http from './http';

const favoriteThingService = {
  create(favoriteThingData) {
    return http.post('/favorite-things/', favoriteThingData);
  },
  update({ favoriteThingId, updatedFavoriteThingData }) {
    return http.patch(
      `/favorite-things/${favoriteThingId}/`,
      updatedFavoriteThingData
    )
  },
  delete({ favoriteThingId }) {
    return http.delete( `/favorite-things/${favoriteThingId}/`)
  }
}

export default favoriteThingService;
