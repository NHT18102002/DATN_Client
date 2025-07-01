import { Actions } from "../actions/index.js";

const initialState = {
  userId: JSON.parse(localStorage.getItem("userInfo"))?.userId || null,
  avatar: JSON.parse(localStorage.getItem("userInfo"))?.avatar || null,
  email: JSON.parse(localStorage.getItem("userInfo"))?.email || null,
  username: JSON.parse(localStorage.getItem("userInfo"))?.username || null,
  vendor: JSON.parse(localStorage.getItem("userInfo"))?.vendor || null,
  productCart: [],
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.GET_USER_INFO:
      // console.log("user info payload:", action.payload);
      const { username, userId, avatar, email, vendor } = action.payload;
      return { ...state, username, avatar, userId, email, vendor };
    default:
      return { ...state };
  }
}

export default userReducer;
