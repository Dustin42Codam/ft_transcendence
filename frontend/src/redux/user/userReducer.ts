import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
} from "./userTypes";

const initialState = {
  loading: false,
  users: [],
  error: "",
};

const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_USERS_SUCCESS:
      return {
        loading: false,
        users: action.payload,
        error: "",
      };
    case FETCH_USERS_FAILURE:
      return {
        error: action.payload,
        loading: false,
        users: [],
      };
    default:
      return state;
  }
};

export default userReducer;
