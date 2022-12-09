import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import { chatUpdated } from "../redux/chat/chatsSlice";
import { useAppSelector, useAppDispatch } from "../redux/hooks";

export const EditChatForm = () => {
  const { chatId } = useParams();

  const chat = useAppSelector((state) =>
    state.chats.find((chat) => chat.id === chatId)
  );

  const [title, setTitle] = useState(chat?.title);
  const [content, setContent] = useState(chat?.content);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onTitleChanged = (e: any) => setTitle(e.target.value);
  const onContentChanged = (e: any) => setContent(e.target.value);

  const onSaveChatClicked = () => {
    if (title && content) {
      dispatch(chatUpdated({ id: chatId, title, content }));
      navigate(`/chats/${chatId}`);
      //   history.push(`/chats/${chatId}`)
    }
  };

  return (
    <Wrapper>
      <section>
        <h2>Edit Chat</h2>
        <form>
          <label htmlFor="chatTitle">Chat Title:</label>
          <input
            type="text"
            id="chatTitle"
            name="chatTitle"
            placeholder="What's on your mind?"
            value={title}
            onChange={onTitleChanged}
          />
          <label htmlFor="chatContent">Content:</label>
          <textarea
            id="chatContent"
            name="chatContent"
            value={content}
            onChange={onContentChanged}
          />
        </form>
        <button type="button" onClick={onSaveChatClicked}>
          Save Chat
        </button>
        <div className="navContent">
          <div className="navLinks">
            <Link to={`/chats/${chatId}`}>Back</Link>
          </div>
        </div>
      </section>
    </Wrapper>
  );
};
