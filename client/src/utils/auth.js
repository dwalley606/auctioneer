
export const setToken = (token) => {
  console.log("Saving token:", token);
  if (token) {
    document.cookie = `access_token=${token}; path=/; SameSite=None; Secure`;
    console.log("Token saved in cookie:", document.cookie);
  }
};

export const getAuthHeaders = () => {
  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];
    console.log("Retrieved token from cookie:", token);
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
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];
    console.log("Retrieved token from cookie:", token);
    return token;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

export const isTokenExpired = (token) => {
  try {
    const decoded = decode(token);
    console.log("Decoded token:", decoded);
    const isExpired = decoded.exp * 1000 < Date.now();
    console.log("Token is expired:", isExpired);
    return isExpired;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

export const getValidToken = () => {
  const token = getToken();
  console.log("Retrieved token for validation:", token); // Debugging line
  const validToken = !token || isTokenExpired(token) ? null : token;
  console.log("Valid token:", validToken); // Debugging line
  return validToken;
};

class AuthService {
  getProfile() {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
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
    const match = document.cookie.match(
      new RegExp("(^| )access_token=([^;]+)")
    );
    if (match) {
      return match[2];
    }
    return null;
  }

  login(idToken) {
    this.setToken(idToken);
    window.location.assign("/");
  }

  setToken(token) {
    console.log("Saving token:", token);
    if (token) {
      document.cookie = `access_token=${token}; path=/; SameSite=None; Secure`;
      console.log("Token saved in cookie:", document.cookie);
    }
  }

  logout() {
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure";
    window.location.assign("/");
  }
}

export default new AuthService();
