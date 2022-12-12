import React, { useState } from "react";
import { Link } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import { addNewPost } from "../../redux/slices/postsSlice";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";

export const AddPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const dispatch = useAppDispatch();

  const users = useAppSelector((state) => state.users);

  const onTitleChanged = (e: any) => setTitle(e.target.value);
  const onContentChanged = (e: any) => setContent(e.target.value);
  const onUserChanged = (e: any) => setUserId(e.target.value);

  let canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'
  
  const onSavePostClicked = async () => {
	  if (canSave) {
		  try {
        setAddRequestStatus('pending')
		
		/* 
		unwrap returns a new Promise that either has the actual action.payload
		value from a fulfilled action, or throws an error if it's the rejected action.		
		*/
        await dispatch(addNewPost({ title, content, user: userId })).unwrap()

		setTitle('')
        setContent('')
        setUserId('')
      } catch (err) {
        console.error('Failed to save the post: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
    }
  }

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.display_name}
    </option>
  ));

  return (
    <Wrapper>
      <section>
        <h2>Add a New fake post</h2>
        <form>
          <label htmlFor="postTitle">post Title:</label>
          <input
            type="text"
            id="postTitle"
            name="postTitle"
            value={title}
            onChange={onTitleChanged}
          />
          <label htmlFor="postAuthor">Author:</label>
          <select id="postAuthor" value={userId} onChange={onUserChanged}>
            <option value=""></option>
            {usersOptions}
          </select>
          <label htmlFor="postContent">Content:</label>
          <textarea
            id="postContent"
            name="postContent"
            value={content}
            onChange={onContentChanged}
          />
          <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
            Save Post
          </button>
        </form>
        <div className="navContent">
          <div className="navLinks">
            <Link to="/posts">Back</Link>
          </div>
        </div>
      </section>
    </Wrapper>
  );
};
