import api from "../api/axios";

export const artifactService = {
  create: (taskId, data) =>
    api.post(`/tasks/${taskId}/artifacts`, data).then((r) => r.data),

  delete: (artifactId) =>
    api.delete(`/artifacts/${artifactId}`),
};
