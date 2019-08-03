import http from './http';

const categoryService = {
  get() {
    return http.get('/categories/');
  },
  create(categoryData) {
    return http.post('/categories/', categoryData);
  },
  delete(categoryId) {
    return http.delete(`/categories/${categoryId}`);
  }
}

export default categoryService;
