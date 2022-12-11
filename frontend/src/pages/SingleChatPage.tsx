import React from "react";
import Wrapper from "../components/Wrapper";
import { useAppSelector } from "../redux/hooks";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ChatCreator } from "./ChatCreator";
import { TimeAgo } from "./TimeAgo";
import { ReactionButtons } from "./ReactionButtons";
import { selectChatById } from "../redux/chat/chatsSlice";

export const SingleChatPage = () => {
  const { chatId } = useParams();

  const chat = useAppSelector((state) => selectChatById(state, chatId));

  if (!chat) {
    return (
      <Wrapper>
        <section>
          <h2>Chat not found!</h2>
        </section>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <section>
        <article className="chat">
          <h2>{chat.name}</h2>
          <ChatCreator userId={chat.user} />
          <TimeAgo timestamp={chat.date} />
          <p className="chat-content">{chat.content}</p>
          <ReactionButtons message={chat} />
          <Link to={`/editChat/${chat.id}`}>Edit Chat</Link>
        </article>
      </section>
      <div className="navContent">
        <div className="navLinks">
          <Link to="/chats">Back</Link>
        </div>
      </div>
    </Wrapper>
  );
};
