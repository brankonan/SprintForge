import api from "../api/axios";

export const userService = {
  explore: (params = {}) =>
    api.get("/user/explore", { params }).then((r) => r.data),

  getPortfolio: (userId) =>
    api.get(`/user/${userId}/portfolio`).then((r) => r.data),

  getStats: () =>
    api.get("/user/stats").then((r) => r.data),
};
