import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Setting up Mock Service Worker to intercept API calls during testing
export const handlers = [
  http.post('http://localhost:5000/api/v1/auth/login', () => {
    return HttpResponse.json({
      success: true,
      token: 'mock_jwt_token_for_tests'
    });
  }),
];

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
