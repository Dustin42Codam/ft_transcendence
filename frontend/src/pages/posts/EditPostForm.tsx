import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Wrapper from "../../components/Wrapper";
import { postUpdated, selectPostById } from "../../redux/slices/postsSlice";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";

export const EditPostForm = () => {
  const { postId } = useParams();

  const post = useAppSelector((state) => selectPostById(state, postId));

  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.content);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onTitleChanged = (e: any) => setTitle(e.target.value);
  const onContentChanged = (e: any) => setContent(e.target.value);

  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(postUpdated({ id: postId, title, content }));
      navigate(`/posts/${postId}`);
      //   history.push(`/posts/${postId}`)
    }
  };

  return (
    <Wrapper>
      <section>
        <h2>Edit Post</h2>
        <form>
          <label htmlFor="postTitle">Post Title:</label>
          <input
            type="text"
            id="postTitle"
            name="postTitle"
            placeholder="What's on your mind?"
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
        </form>
        <button type="button" onClick={onSavePostClicked}>
          Save Post
        </button>
        <div className="navContent">
          <div className="navLinks">
            <Link to={`/posts/${postId}`}>Back</Link>
          </div>
        </div>
      </section>
    </Wrapper>
  );
};
