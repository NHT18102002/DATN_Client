import {instanceCoreApi} from "./setupAxios.js";
import {AUTH_API, USER_API} from "./apis/index.js";
import {IMAGE_UPLOAD_API} from "./apis/index.js"

export const getMe = async () => {
  return instanceCoreApi.get(AUTH_API.GET_ME)
}

export const getUserInfo = async () => {
  return instanceCoreApi.get(USER_API.GET_USER_INFO)
}

export const updateUserInfo = async (data) => {
  return instanceCoreApi.patch(USER_API.UPDATE_USER_INFO, data)
}

export const updateAvatar = async (data) => {
  return instanceCoreApi.post(IMAGE_UPLOAD_API.UPLOAD_IMAGE, data)
  // console.log(data)
}