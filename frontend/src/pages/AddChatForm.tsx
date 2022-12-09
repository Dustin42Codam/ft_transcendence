import { nanoid } from "@reduxjs/toolkit";
import React, { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import { chatAdded } from "../redux/chat/chatsSlice";
import { useAppSelector, useAppDispatch } from "../redux/hooks";

export const AddChatForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");

  const dispatch = useAppDispatch();

  const users = useAppSelector((state) => state.users);

  const onTitleChanged = (e: any) => setTitle(e.target.value);
  const onContentChanged = (e: any) => setContent(e.target.value);
  const onUserChanged = (e: any) => setUserId(e.target.value);

  const onSaveChatClicked = () => {
    if (title && content) {
      dispatch(chatAdded(title, content, userId));

      setTitle("");
      setContent("");
    }
  };

  const canSave = Boolean(title) && Boolean(content) && Boolean(userId);

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <Wrapper>
      <section>
        <h2>Add a New fake chat</h2>
        <form>
          <label htmlFor="postTitle">chat Title:</label>
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
          <button type="button" onClick={onSaveChatClicked} disabled={!canSave}>
            Save Chat
          </button>
        </form>
        <div className="navContent">
          <div className="navLinks">
            <Link to="/chats">Back</Link>
          </div>
        </div>
      </section>
    </Wrapper>
  );
};
