import React, { SyntheticEvent, useState } from "react";
import Wrapper from "../components/Wrapper";

export const AddUserForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onTitleChanged = (e: any) => setTitle(e.target.value);
  const onContentChanged = (e: any) => setContent(e.target.value);

  return (
    <Wrapper>
      <section>
        <h2>Add a New User</h2>
        <form>
          <label htmlFor="postTitle">Post Title:</label>
          <input
            type="text"
            id="postTitle"
            name="postTitle"
            value={title}
            onChange={onTitleChanged}
          />
          <label htmlFor="postContent">Content:</label>
          <textarea
            id="postContent"
            name="postContent"
            value={content}
            onChange={onContentChanged}
          />
          <button type="button">Save Post</button>
        </form>
      </section>
    </Wrapper>
  );
};
