import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import Wrapper from "../components/Wrapper";
import { Link } from "react-router-dom";
import { ChatCreator } from "./ChatCreator";
import { TimeAgo } from "./TimeAgo";
import { ReactionButtons } from "./ReactionButtons";
import { fetchChats, selectAllChats } from "../redux/chat/chatsSlice";

export const ChatList = () => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector(selectAllChats);

  const chatStatus = useAppSelector((state) => state.chats.status);

  useEffect(() => {
    if (chatStatus === "idle") {
      dispatch(fetchChats());
    }
  }, []);

  const renderedChats = chats.map((chat: any) => (
    <article className="chat-excerpt" key={chat.id}>
      <h3>{chat.name}</h3>
      {/* <ChatCreator userId={chat.user} /> */}
      {/* <TimeAgo timestamp={chat.date} /> */}
      {/* <ReactionButtons message={chat} /> */}
      <p className="chat-content">{chat.type}</p>
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
