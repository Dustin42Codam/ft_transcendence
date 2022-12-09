import React from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import Wrapper from "../components/Wrapper";
import { Link } from "react-router-dom";
import { ChatCreator } from "./ChatCreator";
import { TimeAgo } from "./TimeAgo";
import { ReactionButtons } from "./ReactionButtons"

export const ChatList = () => {
  const chats = useAppSelector((state) => state.chats);

  const renderedChats = chats.map((chat) => (
    <article className="chat-excerpt" key={chat.id}>
      <h3>{chat.title}</h3>
      <ChatCreator userId={chat.user} />
	  <TimeAgo timestamp={chat.date} />
	  <ReactionButtons message={chat}/>
      <p className="chat-content">{chat.content.substring(0, 100)}</p>
      <Link to={`/chats/${chat.id}`} className="button muted-button">
        View Chat
      </Link>
    </article>
  ));

  return (
    <Wrapper>
      <section className="chats-list">
        <div className="navContent">
          <div className="navLinks">
            <Link to="/add/chat">Add Chat</Link>
          </div>
        </div>
        <h2>Chats</h2>
        {renderedChats}
      </section>
    </Wrapper>
  );
};
