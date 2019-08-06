jest.mock('axios');

import axios from 'axios';
import toast from 'toast-me';
import http from '../../src/services/http.js' // eslint-disable-line

describe('http service', () => {
  it('should not pass responses to the next receiver', () => {
    const responseInterceptor = axios.interceptors
      .response
      .use
      .mock
      .calls[0][0];

    const response = {
      data: 'test response'
    }
    expect(responseInterceptor(response)).toEqual(response);
  });

  it('should intercept network errors and toast error', () => {
    const errorInterceptor = axios.interceptors
      .response
      .use
      .mock
      .calls[0][1];

    const error = {
      data: 'test response'
    }

    return errorInterceptor(error)
      .catch(returnedError => {
        expect(toast).toBeCalledWith(
          'Network error! Please check your internet connection.',
          'error'
        )
        expect(returnedError).toEqual(error)
      });
  });

  it('should pass error to next receiver if not networ error', () => {
    const errorInterceptor = axios.interceptors
      .response
      .use
      .mock
      .calls[0][1];

    const error = {
      response: {
        data: 'test response'
      }
    }
    toast.mockReset();
    return errorInterceptor(error)
      .catch(returnedError => {
        expect(toast).not.toBeCalled()
        expect(returnedError).toEqual(error)
      });
  });
})
