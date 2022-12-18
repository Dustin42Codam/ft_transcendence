import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import GroupChatTable from "./GroupChatTable";
import DirectChatTable from "./DirectChatTable";
import JoinableChatTable from "./JoinableChatTable";
import ChatCreate from "./ChatCreate";
import AddIcon from "@mui/icons-material/Add";
import GroupAdd from "@mui/icons-material/GroupAdd";
import PersonSearch from "@mui/icons-material/PersonSearch";
import { useAppSelector } from "../redux/hooks";
import { selectJoinableChats } from "../redux/slices/chatsSlice";
import PopUp from "./PopUp";
import toastr from "toastr";

const Menu = (props: any) => {
  const [activeDm, setActiveDm] = useState(false);
  const [activeChanels, setActiveChanels] = useState(false);
  const [createChatPopUp, setCreateChatPopUp] = useState(false);
  const [joinChanel, setJoinChanel] = useState(false);
  const joinableChats = useAppSelector(selectJoinableChats);

  const joinChats = () => {
    if (joinableChats.length > 0) {
      setJoinChanel(!joinChanel);
    } else {
      toastr.error('You do not have any chats to join');
			// Would be nice to use this but it the CSS does not work
      alert("You do not have any chats to join");
    }
  };
  return (
    <nav
      id=""
      className={props.className}>
    
      <div className="">
        <ul className="nav">
          <li className="">
            <NavLink to={"/"} className="">
              Dashboard
            </NavLink>
          </li>
          <li className="">
            <NavLink to={"/profile"} className="">
              Profile
            </NavLink>
          </li>
          <li className="">
            <NavLink to={"/posts"} className="">
              Posts
            </NavLink>
          </li>
          <li className="">
            <NavLink to={"/users"} className="">
              Users
            </NavLink>
          </li>
          <li className="">
            <NavLink to={"/games"} className="">
              Games
            </NavLink>
          </li>
          <li className="">
            <div className="">
              {activeDm === true ? (
                <React.Fragment>
                  <div onClick={() => setActiveDm(!activeDm)}>
                    <ArrowDropDownIcon />
                    DM
                  </div>
                  <DirectChatTable />
                  <div onClick={() => setCreateChatPopUp(!createChatPopUp)}>
                    <PersonSearch /> Message someone
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div onClick={() => setActiveDm(!activeDm)}>
                    <ArrowRightIcon />
                    DM
                  </div>
                </React.Fragment>
              )}
            </div>
          </li>
          <li className="">
            <div className="">
              {activeChanels === true ? (
                <React.Fragment>
                  <div onClick={() => setActiveChanels(!activeChanels)}>
                    <ArrowDropDownIcon /> Chats
                  </div>
                  <GroupChatTable />
                  <div onClick={() => setCreateChatPopUp(!createChatPopUp)}>
                    <AddIcon /> Create chanel
                  </div>
                  <div onClick={() => joinChats()}>
                    <GroupAdd /> Join chanel
                  </div>
                  {joinChanel && (
                    <PopUp
                      content={<JoinableChatTable />}
                      handleClose={() => joinChats()}
                    />
                  )}
                  {createChatPopUp && (
                    <PopUp
                      content={<ChatCreate />}
                      handleClose={() => setCreateChatPopUp(!createChatPopUp)}
                    />
                  )}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div onClick={() => setActiveChanels(!activeChanels)}>
                    <ArrowRightIcon />
                    Chats
                  </div>
                </React.Fragment>
              )}
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Menu;
