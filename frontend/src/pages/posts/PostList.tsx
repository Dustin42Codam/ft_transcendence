import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import Wrapper from "../../components/Wrapper";
import { Link } from "react-router-dom";
import { TimeAgo } from "../TimeAgo";
import { ReactionButtons } from "../ReactionButtons";
import { fetchPosts, selectAllPosts } from "../../redux/slices/postsSlice";
import { PostCreator } from "./PostCreator";
// import { Spinner } from "../Spinner";

const PostExcerpt = ({ post }: any) => {
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <div>
        <PostCreator userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      {/* <ReactionButtons post={post} /> */}
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  );
};

export const PostList = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectAllPosts);

  const postStatus = useAppSelector((state) => state.posts.status);
  const error = useAppSelector((state) => state.posts.error);

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

//   let content;

//   if (postStatus === "loading") {
//     // content = <Spinner text="Loading..." />
//   } else if (postStatus === "succeeded") {
//     // Sort posts in reverse chronological order by datetime string
//     // const orderedPosts = posts
//     //   .slice()
//     //   .sort((a, b) => b.date.localeCompare(a.date))

//     content = posts.map((post: any) => (
//       <PostExcerpt key={post.id} post={post} />
//     ));
//   } else if (postStatus === "failed") {
//     content = <div>{error}</div>;
//   }

  const renderedPosts = posts.map((post: any) => (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.name}</h3>
      <PostCreator userId={post.user} />
      <TimeAgo timestamp={post.date} />
      <ReactionButtons message={post} />
      <p className="post-content">{post.type}</p>
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  ));

  return (
    <Wrapper>
      <section className="posts-list">
        <div className="navContent">
          <div className="navLinks">
            <Link to="/add/post">Add Post</Link>
          </div>
        </div>
        <h2>Posts</h2>
        {renderedPosts}
      </section>
    </Wrapper>
  );
};
