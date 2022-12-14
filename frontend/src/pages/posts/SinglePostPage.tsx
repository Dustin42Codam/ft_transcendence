import React from "react";
import Wrapper from "../../components/Wrapper";
import { useAppSelector } from "../../redux/hooks";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { PostCreator } from "./PostCreator";
import { TimeAgo } from "../TimeAgo";
import { ReactionButtons } from "../ReactionButtons";
import { selectPostById } from "../../redux/slices/postsSlice";

export const SinglePostPage = () => {
  const { postId } = useParams();

  const post = useAppSelector((state) => selectPostById(state, postId));

  if (!post) {
    return (
      <Wrapper>
        <section>
          <h2>Post not found!</h2>
        </section>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <section>
        <article className="post">
          <h2>{post.name}</h2>
          <PostCreator userId={post.user} />
          <TimeAgo timestamp={post.date} />
          <p className="post-content">{post.content}</p>
          <ReactionButtons message={post} />
          <Link to={`/editPost/${post.id}`}>Edit Post</Link>
        </article>
      </section>
      <div className="navContent">
        <div className="navLinks">
          <Link to="/posts">Back</Link>
        </div>
      </div>
    </Wrapper>
  );
};
