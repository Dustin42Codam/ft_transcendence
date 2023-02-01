import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import GroupAdd from "@mui/icons-material/GroupAdd";
import PeopleIcon from "@mui/icons-material/People";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import DashboardIcon from "@mui/icons-material/Dashboard";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import GroupChatTable from "./chat/GroupChatTable";
import DirectChatTable from "./chat/DirectChatTable";
import JoinableChatTable from "./chat/JoinableChatTable";
import ChatCreate from "./chat/ChatCreate";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchDirectChats, selectJoinableChats } from "../redux/slices/chatsSlice";
import PopUp from "./PopUp";
import { toast } from "react-toastify";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCommentIcon from '@mui/icons-material/AddComment';
import AddIcon from '@mui/icons-material/Add';
import "./Menu.css";


const Menu = (props: any) => {
  const [activeDm, setActiveDm] = useState(false);
  const [activeChannels, setActiveChannels] = useState(false);
  const [createChatPopUp, setCreateChatPopUp] = useState(false);
  const [joinChannel, setJoinChannel] = useState(false);
  const [createChannel, setCreateChannel] = useState(false);
  const joinableChats = useAppSelector(selectJoinableChats);
  const dispatch = useAppDispatch();

  const joinChats = () => {
    if (joinableChats.length > 0) {
      setJoinChannel(!joinChannel);
    } else {
      toast.info(`There are no chats to join!`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <>
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
          to={"/game"}
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
                Direct Messages
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
                  onClick={() => {
                    setActiveDm(!activeDm)
                    dispatch(fetchDirectChats());
                  }}
                />
                Direct Messages
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
          {activeChannels === true ? (
            <React.Fragment>
              <p>
              <div className="channelRow">
                <ArrowDropDownIcon
                  sx={{
                    "&:hover": { backgroundColor: "grey" },
                    borderRadius: "10%",
                  }}
                  onClick={() => setActiveChannels(!activeChannels)}
                />
                Channels
{/*                 <div className="addIcon">
                  <AddIcon
                    sx={{
                      ml: 17,
                      "&:hover": { backgroundColor: "grey" },
                      borderRadius: "10%",
                    }}
                    onClick={() => setCreateChatPopUp(!createChatPopUp)}
                    />
                </div> */}
              </div>
              </p>
              {createChatPopUp && (
                <PopUp
                  content={<ChatCreate />}
                  handleClose={() => setCreateChatPopUp(!createChatPopUp)}
                />
              )}
              <GroupChatTable />
              <p className="navChatOption" onClick={() => setCreateChannel(true)}>
                <AddIcon /> Create channel
              </p>
              <p className="navChatOption" onClick={() => joinChats()}>
                <GroupAdd /> Join channel
              </p>
              {joinChannel && (
                <PopUp
                  content={
                    <JoinableChatTable setJoinableChats={setJoinChannel} />
                  }
                  handleClose={() => joinChats()}
                />
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p>
              <div className="channelRow">
                <ArrowRightIcon
                  sx={{
                    "&:hover": { backgroundColor: "grey" },
                    borderRadius: "10%",
                  }}
                  onClick={() => setActiveChannels(!activeChannels)}
                />
                Channels
{/*                 <div className="addIcon">
                  <AddIcon
                    sx={{
                      ml: 17,
                      "&:hover": { backgroundColor: "grey" },
                      borderRadius: "10%",
                    }}
                    onClick={() => setCreateChatPopUp(!createChatPopUp)}
                    />
                </div> */}
              </div>
            </p>
            </React.Fragment>
          )}
        </div>
      </div>
    </nav>
    <LogoutIcon />
    </>
  );
};

export default Menu;
