const TOKEN_KEY = "token";

// Check if user has open session
export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

// Save JWT in local storage
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
