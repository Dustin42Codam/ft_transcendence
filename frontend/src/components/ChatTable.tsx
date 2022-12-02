import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CastleIcon from "@mui/icons-material/Castle";
import PublicIcon from "@mui/icons-material/Public";
import "./ChatTable.css";

export enum ChatroomType {
  PUBLIC = "public",
  PROTECTED = "protected",
  PRIVATE = "private",
  DIRECT = "direct",
  DEFAULT = "",
}

type Chats = {
  name: string;
  type: ChatroomType;
};

interface IState {
  chats: Chats;
}

/*
const chats = [
  { name: "unit testing chat", type: ChatroomType.PUBLIC },
  { name: "HACKING chat", type: ChatroomType.PROTECTED },
  { name: "Club mate", type: ChatroomType.PROTECTED },
  {
    name: "asdlfjsalkdjflksdjfiawojgoaet;jhd;favj ;dsja ;kj",
    type: ChatroomType.PROTECTED,
  },
];
*/

const CreateChat = () => {
  const rows = [];
	const [chats, setChats] = useState<Chats[]>([]);

	useEffect(() => {
    async function fetchChats() {
      const response = await axios
        .get("chatroom")
        .then(res => setChats(res.data))
        .catch(err => console.log(err));
    }
    if (!chats.length) {
      fetchChats();
    }
  }, []);

  let navigate = useNavigate();

  function handleClick(name: string) {
    navigate("../chats/" + name, { replace: true });
  }
  for (let i = 0; chats.length > i; i++) {
    if (chats[i].type === ChatroomType.PROTECTED) {
      rows.push(
        <div key={i} className="chatRow" onClick={() => handleClick(chats[i].name)}>
          <CastleIcon />
          {chats[i].name}
        </div>
      );
    } else if (chats[i].type === ChatroomType.PUBLIC) {
      rows.push(
        <div key={i} className="chatRow" onClick={() => handleClick(chats[i].name)}>
          <PublicIcon />
          {chats[i].name}
        </div>
      );
    }
  }

  return <div className="chatTableContainer">{rows}</div>;
};

export default CreateChat;
