import axiosClient from './axiosClient';

export const reviewApi = {
  async getByLaptop(laptopId, signal) {
    const res = await axiosClient.get('/reviews', {
      params: { laptopId, _sort: 'createdAt', _order: 'desc' },
      signal,
    });
    return res.data;
  },

  async create(payload) {
    const res = await axiosClient.post('/reviews', payload);
    return res.data;
  },
};
