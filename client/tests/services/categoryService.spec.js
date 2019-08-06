import http from '../../src/services/http';
import categoryService from '../../src/services/categoryService';

jest.mock('../../src/services/http');

describe('Category Service', () => {
  const resourceEndpoint = '/categories/';

  describe('get method', () => {
    it('should call http get method', () => {
      categoryService.get();

      expect(http.get).toBeCalledWith(resourceEndpoint);
    })
  });

  describe('create method', () => {
    it('should call http post method', () => {
      const categoryData = {
        name: 'Test category'
      }

      categoryService.create(categoryData)

      expect(http.post).toBeCalledWith(resourceEndpoint, categoryData)
    })
  });

  describe('update method', () => {
    it('should call http patch method', () => {
      const categoryId = 1;
      const updatedCategoryData = {
        name: 'Test category'
      };

      categoryService.update({ categoryId, updatedCategoryData });

      expect(http.patch).toBeCalledWith(
        `${resourceEndpoint}${categoryId}/`,
        updatedCategoryData
      )
    })
  });

  describe('delete method', () => {
    it('should call http delete method', () => {
      const categoryId = 1;

      categoryService.delete(categoryId);

      expect(http.delete).toBeCalledWith(
        `${resourceEndpoint}${categoryId}/`
      )
    })
  })
});
