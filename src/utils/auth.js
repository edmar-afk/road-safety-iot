
const USER_KEY = "currentUser";
const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

// Save user profile and JWT tokens after login.
export function saveAuthData(data) {
  if (!data?.user || !data?.access || !data?.refresh) {
    throw new Error("Invalid login response from server.");
  }

  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  localStorage.setItem(ACCESS_KEY, data.access);
  localStorage.setItem(REFRESH_KEY, data.refresh);
}

// Get the complete saved user profile.
export function getCurrentUser() {
  try {
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

// Get JWT tokens.
export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

// Check whether login data exists.
export function isLoggedIn() {
  return Boolean(getAccessToken() && getCurrentUser());
}

// Clear login data.
export function logout() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}
