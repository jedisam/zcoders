import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem ('item'),
  isAuthenticated: null,
  isLoading: true,
  user: null,
};

export default (state = initialState, action) => {
  const {type, payload} = action;

  switch (type) {
    case REGISTER_SUCCESS:
      localStorage.setItem ('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
      localStorage.removeItem ('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isLoading: true,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: payload,
      };
    default:
      return state;
  }
};
