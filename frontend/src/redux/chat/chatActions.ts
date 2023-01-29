import axios from "axios";

import { Chat } from "../../models/Chats";

import {
  FETCH_CHATS_REQUEST,
  FETCH_CHATS_SUCCESS,
  FETCH_CHATS_FAILURE,
} from "./chatTypes";

export const fetchChatsRequest = () => {
  return {
    type: FETCH_CHATS_REQUEST,
  };
};

export const fetchChatsSuccess = (chat: Chat[]) => {
  return {
    type: FETCH_CHATS_SUCCESS,
    payload: chat,
  };
};

export const fetchChatsFailure = (error: any) => {
  return {
    type: FETCH_CHATS_FAILURE,
    payload: error,
  };
};

export const fetchChats = () => {
  return (dispatch: any) => {
    dispatch(fetchChatsRequest());
    axios
      .get("chatroom/all") // maybe this is wrong
      .then((response) => {
        const chats = response.data;
        console.log("+++++++++++++++++++", chats);
        dispatch(fetchChatsSuccess(chats));
      })
      .catch((error) => dispatch(fetchChatsFailure(error.message)));
  };
};