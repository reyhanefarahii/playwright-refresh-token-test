import { test, expect } from '@playwright/test';

test('Refresh token flow', async ({ request }) => {
  const baseURL = 'http://localhost:3000';

  const loginResponse = await request.post(`${baseURL}/auth/login`, {
    data: {
      username: 'test',
      password: '1234',
    },
  });
  const loginData = await loginResponse.json();
  let accessToken = loginData.accessToken;
  let refreshToken = loginData.refreshToken;

  const profileResponse401 = await request.get(`${baseURL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  expect(profileResponse401.status()).toBe(401);
  const errorResponse = await profileResponse401.json();
  expect(errorResponse.error).toBe('TokenExpired');

  const refreshResponse = await request.post(`${baseURL}/auth/refresh`, {
    data: {
      refreshToken: refreshToken,
    },
  });
  const refreshData = await refreshResponse.json();
  accessToken = refreshData.accessToken;

  const profileResponse200 = await request.get(`${baseURL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  expect(profileResponse200.status()).toBe(200);
  const profileData = await profileResponse200.json();
  expect(profileData).toHaveProperty('name');
  expect(profileData).toHaveProperty('email');
});
