import {jwtDecode} from "jwt-decode";

export const setToken = (token) => {
  if (token) {
    localStorage.setItem("id_token", token);
        console.log("Token set in localStorage:", token);

  }
};

export const getAuthHeaders = () => {
  try {
    const token = localStorage.getItem("id_token");
        console.log("Auth Headers token:", token);

    return {
      Authorization: token ? `Bearer ${token}` : undefined,
    };
  } catch (error) {
    console.error("Error retrieving token:", error);
    return {};
  }
};

export const getToken = () => {
  try {
    const token = localStorage.getItem("id_token");
        console.log("getToken from localStorage:", token);

    return token;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

export const getValidToken = () => {
  const token = getToken();
  return token && !isTokenExpired(token) ? token : null;
};

class AuthService {
  getProfile() {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }

  isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    return localStorage.getItem("id_token");
  }

  login(idToken) {
    localStorage.setItem("id_token", idToken);
    window.location.assign("/");
  }

  logout() {
    localStorage.removeItem("id_token");
    window.location.assign("/");
  }
}

export default new AuthService();
