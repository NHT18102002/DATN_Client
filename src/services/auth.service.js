import {instanceCoreApi} from "./setupAxios.js";
import { AUTH_API } from "./apis/index.js";

export const registerUser = async (data) => {
  return instanceCoreApi.post('/auth/register', data)
}

export const loginUser = async (data) => {
  return instanceCoreApi.post('/auth/login', data)
}

export const getMe = async () => {
  return instanceCoreApi.get(AUTH_API.GET_ME)
}