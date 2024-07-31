import {jwtDecode} from "jwt-decode";

export const saveToken = (token) => {
  if (token) {
    document.cookie = `access_token=${token}; path=/; SameSite=None; Secure`;
  }
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
    saveToken(idToken);
    window.location.assign("/");
  }

  logout() {
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure";
    window.location.assign("/");
  }
}

export default new AuthService();
