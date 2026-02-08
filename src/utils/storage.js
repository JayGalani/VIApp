import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  MEDIA_LIST: 'media_list',
};

export const saveMediaList = async (list) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.MEDIA_LIST, JSON.stringify(list));
  } catch (e) {
    return false;
  }
};

export const getMediaList = async () => {
  try {
    const list = await AsyncStorage.getItem(STORAGE_KEYS.MEDIA_LIST);
    return list ? JSON.parse(list) : [];
  } catch (e) {
    return [];
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    return false;
  }
};

export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
  } catch {
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
  } catch {
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
  } catch {
  }
};
