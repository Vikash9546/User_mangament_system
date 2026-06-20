import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUsers = async ({ pageParam = undefined, limit = 10, search = '', status = 'active' }: any) => {
  const { data } = await api.get('/users', {
    params: {
      cursor: pageParam,
      limit,
      search,
      status,
    },
  });
  return data;
};

export const getUserById = async (id: string) => {
  const { data } = await api.get(`/users/${id}`);
  return data.data;
};

export const createUser = async (userData: any) => {
  const { data } = await api.post('/users', userData);
  return data.data;
};

export const updateUser = async (id: string, userData: any) => {
  const { data } = await api.patch(`/users/${id}`, userData);
  return data.data;
};

export const deleteUser = async (id: string) => {
  const { data } = await api.delete(`/users/${id}`);
  return data.data;
};

export const restoreUser = async (id: string) => {
  const { data } = await api.patch(`/users/${id}/restore`);
  return data.data;
};

export const validateDocument = async (payload: { pan?: string; aadhaar?: string }) => {
  const { data } = await api.post('/users/validate-document', payload);
  return data;
};
