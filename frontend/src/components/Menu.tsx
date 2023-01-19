import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import GroupAdd from "@mui/icons-material/GroupAdd";
import PeopleIcon from "@mui/icons-material/People";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import AddIcon from "@mui/icons-material/Add";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import DashboardIcon from "@mui/icons-material/Dashboard";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import GroupChatTable from "./GroupChatTable";
import DirectChatTable from "./DirectChatTable";
import JoinableChatTable from "./JoinableChatTable";
import ChatCreate from "./ChatCreate";
import { useAppSelector } from "../redux/hooks";
import { selectJoinableChats } from "../redux/slices/chatsSlice";
import PopUp from "./PopUp";
import "./Menu.css";
import { socketActions } from "../redux/slices/socketSlice";

import { useAppDispatch } from "../redux/hooks";
import store from "../redux/store";

const Menu = (props: any) => {
  const [activeDm, setActiveDm] = useState(false);
  const [activeChanels, setActiveChanels] = useState(false);
  const [createChatPopUp, setCreateChatPopUp] = useState(false);
  const [joinChanel, setJoinChanel] = useState(false);
  const joinableChats = useAppSelector(selectJoinableChats);


  const joinChats = () => {
  };
  return (
    <nav className={props.className}>
      <div className="sideNavContainer">
        <NavLink
          to={"/dashboard"}
          className="navItem"
          style={{ textDecoration: "none" }}
        >
          <p className="navItemHiglight">
            <DashboardIcon />
            Dashboard
          </p>
        </NavLink>
        <NavLink
          to={"/profile"}
          className="navItem"
          style={{ textDecoration: "none" }}
        >
          <p className="navItemHiglight">
            <SentimentSatisfiedAltIcon />
            Profile
          </p>
        </NavLink>
        <NavLink
          to={"/users"}
          className="navItem"
          style={{ textDecoration: "none" }}
        >
          <p className="navItemHiglight">
            <PeopleIcon />
            Users
          </p>
        </NavLink>
        <NavLink
          to={"/games"}
          className="navItem"
          style={{ textDecoration: "none" }}
        >
          <p className="navItemHiglight">
            <SportsTennisIcon />
            Games
          </p>
        </NavLink>
        <div className="navItem">
          {activeDm === true ? (
            <React.Fragment>
              <p>
                <ArrowDropDownIcon
                  sx={{
                    "&:hover": { backgroundColor: "grey" },
                    borderRadius: "10%",
                  }}
                  onClick={() => setActiveDm(!activeDm)}
                />
                DM
              </p>
              {createChatPopUp && (
                <PopUp
                  content={<ChatCreate />}
                  handleClose={() => setCreateChatPopUp(!createChatPopUp)}
                />
              )}
              <DirectChatTable />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p>
                <ArrowRightIcon
                  sx={{
                    "&:hover": { backgroundColor: "grey" },
                    borderRadius: "10%",
                  }}
                  onClick={() => setActiveDm(!activeDm)}
                />
                DM
              </p>
              {createChatPopUp && (
                <PopUp
                  content={<ChatCreate />}
                  handleClose={() => setCreateChatPopUp(!createChatPopUp)}
                />
              )}
            </React.Fragment>
          )}
        </div>
        <div className="navItem">
          {activeChanels === true ? (
            <React.Fragment>
              <p>
                <ArrowDropDownIcon
                  sx={{
                    "&:hover": { backgroundColor: "grey" },
                    borderRadius: "10%",
                  }}
                  onClick={() => setActiveChanels(!activeChanels)}
                />
                Chats
                <AddIcon
                  sx={{
                    ml: 17,
                    "&:hover": { backgroundColor: "grey" },
                    borderRadius: "10%",
                  }}
                  onClick={() => setCreateChatPopUp(!createChatPopUp)}
                />
              </p>
              {createChatPopUp && (
                <PopUp
                  content={<ChatCreate />}
                  handleClose={() => setCreateChatPopUp(!createChatPopUp)}
                />
              )}
              <GroupChatTable />
              <p className="navItemHiglight" onClick={() => joinChats()}>
                <GroupAdd /> Join chanel
              </p>
              {joinChanel && (
                <PopUp
                  content={
                    <JoinableChatTable setJoinableChats={setJoinChanel} />
                  }
                  handleClose={() => joinChats()}
                />
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p>
                <ArrowRightIcon
                  sx={{
                    "&:hover": { backgroundColor: "grey" },
                    borderRadius: "10%",
                  }}
                  onClick={() => setActiveChanels(!activeChanels)}
                />
                Chats
                <AddIcon
                  sx={{
                    ml: 17,
                    "&:hover": { backgroundColor: "grey" },
                    borderRadius: "10%",
                  }}
                  onClick={() => setCreateChatPopUp(!createChatPopUp)}
                />
              </p>
            </React.Fragment>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Menu;
