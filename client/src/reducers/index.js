import {combineReducers} from 'redux';
import alert from './alert';
import register from './auth';
import login from './auth';

export default combineReducers ({
  alert,
  register,
});
