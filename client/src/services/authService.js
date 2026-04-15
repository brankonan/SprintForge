import api from "../api/axios";

export const authService = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }).then((r) => r.data),

  register: (firstName, lastName, email, password) =>
    api.post("/auth/register", { firstName, lastName, email, password }).then((r) => r.data),

  getMe: () =>
    api.get("/auth/me").then((r) => r.data),

  updateProfile: (bio, isPortfolioPublic) =>
    api.put("/auth/profile", { bio, isPortfolioPublic }).then((r) => r.data),
};
