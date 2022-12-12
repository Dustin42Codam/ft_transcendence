import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

type Post = {
	title: string,
	content: string,
	user: string
}

const initialState = {
	posts: [],
  	status: "idle",
  	error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get("post");
  return response.data.data;
});

export const addNewPost = createAsyncThunk(
	'posts/addNewPost',
	// The payload creator receives the partial `{title, content, user}` object
	async (post: Post) => {
	  // We send the initial data to the API
	  const response = await axios.post('post', post)
	  // The response includes the complete post object, including unique ID
	  return response.data;
	}
  )

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postUpdated(state, action) {
      const { id, title, content } = action.payload;
      const existingPost: any = state.posts.find((post: any) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    },
    reactionAdded(state, action) {
      const { messageId, reaction } = action.payload;
      const existingMessage: any = state.posts.find(
        (message: any) => message.id === messageId
      );

      if (existingMessage) {
        existingMessage.reactions[reaction]++;
      }
    },
  },
  // reducers for action creators which are declared outside of createSlice()
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state: any, action) => {
        state.status = "succeeded";
        state.posts = state.posts.concat(action.payload);
      })
      .addCase(fetchPosts.rejected, (state: any, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
	  .addCase(addNewPost.fulfilled, (state: any, action: PayloadAction<Post>) => {
		// We can directly add the new post object to our posts array
		state.posts.posts.push(action.payload)
		})
  },
});

// action creators
export const { postUpdated, reactionAdded } = postsSlice.actions;

// selectors
export const selectAllPosts = (state: any) => state.posts.posts;

export const selectPostById = (state: any, postId: any) =>
  state.posts.posts.find((post: any) => post.id == postId);

// reducer
export default postsSlice.reducer;
