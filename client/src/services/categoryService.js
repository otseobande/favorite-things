import http from './http';

const categoryService = {
  get() {
    return http.get('/categories/');
  },
  create(categoryData) {
    return http.post('/categories/', categoryData);
  },
  update({ categoryId, updatedCategoryData }) {
    return http.patch(`/categories/${categoryId}/`, updatedCategoryData);
  },
  delete(categoryId) {
    return http.delete(`/categories/${categoryId}/`);
  }
}

export default categoryService;
