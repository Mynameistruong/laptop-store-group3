import axiosClient from './axiosClient';

export const catalogApi = {
  async getBrands() {
    const res = await axiosClient.get('/brands');
    return res.data;
  },
  async getCategories() {
    const res = await axiosClient.get('/categories');
    return res.data;
  },
};

export const laptopApi = {
  async getAll(params = {}, signal) {
    const res = await axiosClient.get('/laptops', {
      params,
      signal,
    });

    return {
      items: res.data,
      total: Number(res.headers['x-total-count'] || res.data.length || 0),
    };
  },

  async getById(id, signal) {
    const res = await axiosClient.get(`/laptops/${id}`, { signal });
    return res.data;
  },

  async getRelated(laptop, signal) {
    const res = await axiosClient.get('/laptops', {
      params: {
        categoryId: laptop.categoryId,
        id_ne: laptop.id,
        _limit: 4,
      },
      signal,
    });
    return res.data;
  },

  async create(payload) {
    const res = await axiosClient.post('/laptops', payload);
    return res.data;
  },

  async update(id, payload) {
    const res = await axiosClient.put(`/laptops/${id}`, payload);
    return res.data;
  },

  async patch(id, payload) {
    const res = await axiosClient.patch(`/laptops/${id}`, payload);
    return res.data;
  },

  async remove(id) {
    const res = await axiosClient.delete(`/laptops/${id}`);
    return res.data;
  },
};
