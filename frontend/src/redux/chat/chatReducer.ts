import {
  FETCH_CHATS_REQUEST,
  FETCH_CHATS_SUCCESS,
  FETCH_CHATS_FAILURE,
} from "./chatTypes";

const initialState = {
  loading: false,
  chats: [],
  error: "",
};

const chatReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_CHATS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_CHATS_SUCCESS:
      return {
        loading: false,
        chats: action.payload,
        error: "",
      };
    case FETCH_CHATS_FAILURE:
      return {
        error: action.payload,
        loading: false,
        chats: [],
      };
    default:
      return state;
  }
};

export default chatReducer;
