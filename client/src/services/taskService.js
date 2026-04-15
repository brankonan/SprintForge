import api from "../api/axios";

export const taskService = {
  getBySprint: (sprintId) =>
    api.get(`/sprints/${sprintId}/tasks`).then((r) => r.data),

  create: (sprintId, data) =>
    api.post(`/sprints/${sprintId}/tasks`, data).then((r) => r.data),

  update: (taskId, data) =>
    api.put(`/tasks/${taskId}`, data).then((r) => r.data),

  updateStatus: (sprintId, taskId, status) =>
    api.patch(`/sprints/${sprintId}/tasks/${taskId}/status`, { status }).then((r) => r.data),

  delete: (taskId) =>
    api.delete(`/tasks/${taskId}`),
};
