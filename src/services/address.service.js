import {instanceCoreApi} from "./setupAxios.js";
import { ADDRESS_API } from "./apis/index.js";

export const getUserAddress = async () => {
  return instanceCoreApi.get(ADDRESS_API.GET_USER_ADDRESS)
}


export const addAddress = (data) => {
  return instanceCoreApi.post(ADDRESS_API.ADD_ADDRESS, data)
}

export const setDefaultAddress = (id) => {
  return instanceCoreApi.patch(ADDRESS_API.SET_DEFAULT_ADDRESS.replace(':id', id))
}

export const updateAddress = async (id, data) => {
  return instanceCoreApi.patch(ADDRESS_API.UPDATE_ADDRESS.replace(':id', id), data);
}

export const deleteAddress = async (id) => {
  return instanceCoreApi.delete(ADDRESS_API.DELETE_ADDRESS.replace(':id', id));
}