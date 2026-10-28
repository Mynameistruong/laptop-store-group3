import axiosClient from './axiosClient';

export const authApi = {
  async login(email, password) {
    const response = await axiosClient.get('/users', {
      params: { email, password },
    });

    const user = response.data?.[0];
    if (!user) {
      throw { status: 401, message: 'Sai email hoặc mật khẩu' };
    }

    const safeUser = { ...user };
    delete safeUser.password;
    const token = btoa(`${safeUser.id}:${Date.now()}`);

    return { token, user: safeUser };
  },
};
