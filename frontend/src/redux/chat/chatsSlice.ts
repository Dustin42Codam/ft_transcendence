import { createSlice, nanoid } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { RootState } from "../store";

const initialState = [
  	{
		id: "1",
		title: "First Chat!",
		content: "Hello!",
		user: "1",
		date: sub(new Date(), {minutes: 10}).toISOString(),
		reactions: {
			thumbsUp: 0,
			hooray: 0,
			heart: 0,
			rocket: 0,
			eyes: 0
		}
	},
  	{
		id: "2",
		title: "Second Chat",
		content: "More text",
		user: "2",
		date: sub(new Date(), {minutes: 5}).toISOString(),
		reactions: {
			thumbsUp: 0,
			hooray: 0,
			heart: 0,
			rocket: 0,
			eyes: 0
		}
	},
];

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    chatAdded: {
      reducer(state, action: any) {
        state.push(action.payload);
      },
      prepare(title: string, content: string, userId: string) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
          },
        };
      },
    },
    chatUpdated(state, action) {
      const { id, title, content } = action.payload;
      const existingChat = state.find((chat) => chat.id === id);
      if (existingChat) {
        existingChat.title = title;
        existingChat.content = content;
      }
    },
	reactionAdded(state, action) {
		const { messageId, reaction } = action.payload
		const existingMessage: any = state.find(message => message.id === messageId)

		if (existingMessage) {
		  existingMessage.reactions[reaction]++;
		}
	}
  },
});

export const { chatAdded, chatUpdated, reactionAdded } = chatsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectChat = (state: RootState) => state.chats;

export default chatsSlice.reducer;
