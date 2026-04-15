import api from "../api/axios";

export const sprintService = {
  getMy: () =>
    api.get("/sprint/my").then((r) => r.data),

  create: (data) =>
    api.post("/sprint", data).then((r) => r.data),

  update: (id, data) =>
    api.put(`/sprint/${id}`, data).then((r) => r.data),

  delete: (id) =>
    api.delete(`/sprint/${id}`),

  updateStatus: (id, status) =>
    api.patch(`/sprint/${id}/status`, { status }).then((r) => r.data),

  getProgress: (id) =>
    api.get(`/sprint/${id}/progress`).then((r) => r.data),
};
