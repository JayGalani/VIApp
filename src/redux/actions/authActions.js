import { STRINGS } from '../../common/strings';
import { setToken, getToken, clearAllData } from '../../utils/storage';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  CHECK_AUTH_REQUEST,
  CHECK_AUTH_SUCCESS,
  CHECK_AUTH_FAILURE,
  LOGOUT,
  CLEAR_ERROR,
} from './types';

const mockLoginApi = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === STRINGS.LOGIN.EMAIL && password === STRINGS.LOGIN.PASSWORD) {
        resolve({ id: '1', name: 'Test User', email: STRINGS.LOGIN.EMAIL, token: 'mock-jwt-token' });
      } else {
        reject(STRINGS.LOGIN.AUTH_ERROR);
      }
    }, 1500);
  });
};

export const loginUser = ({ email, password }) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const user = await mockLoginApi(email, password);
    await setToken(user.token);
    dispatch({ type: LOGIN_SUCCESS, payload: user });
    return user;
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error });
    throw error;
  }
};

export const checkAuthStatus = () => async (dispatch) => {
  dispatch({ type: CHECK_AUTH_REQUEST });
  try {
    const token = await getToken();

    await new Promise(resolve => setTimeout(resolve, 2000));

    if (token) {
      const user = { id: '1', name: 'Test User', email: STRINGS.LOGIN.EMAIL, token };
      dispatch({ type: CHECK_AUTH_SUCCESS, payload: user });
      return user;
    } else {
      dispatch({ type: CHECK_AUTH_SUCCESS, payload: null });
      return null;
    }
  } catch (error) {
    dispatch({ type: CHECK_AUTH_FAILURE, payload: STRINGS.LOGIN.AUTH_STATUS_ERROR });
    throw error;
  }
};

export const logoutUser = () => async (dispatch) => {
  await clearAllData();
  dispatch({ type: LOGOUT });
};

export const clearError = () => ({
  type: CLEAR_ERROR,
});
