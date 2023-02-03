import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import PeopleIcon from "@mui/icons-material/People";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import DashboardIcon from "@mui/icons-material/Dashboard";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import GroupChatTable from "./chat/GroupChatTable";
import DirectChatTable from "./chat/DirectChatTable";
import ChatCreateModal from "./chat/ChatCreateModal";
import JoinChannel from "./JoinChannel";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import KitesurfingIcon from "@mui/icons-material/Kitesurfing";
import {
  fetchDirectChats,
  selectJoinableChats,
} from "../redux/slices/chatsSlice";
import { toast } from "react-toastify";
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
            <div className="navItemHiglight">
              <DashboardIcon />
              Dashboard
            </div>
          </NavLink>
          <NavLink
            to={"/profile"}
            className="navItem"
            style={{ textDecoration: "none" }}
          >
            <div className="navItemHiglight">
              <SentimentSatisfiedAltIcon />
              Profile
            </div>
          </NavLink>
          <NavLink
            to={"/users"}
            className="navItem"
            style={{ textDecoration: "none" }}
          >
            <div className="navItemHiglight">
              <PeopleIcon />
              Users
            </div>
          </NavLink>
          <NavLink
            to={"/game"}
            className="navItem"
            style={{ textDecoration: "none" }}
          >
            <div className="navItemHiglight">
              <SportsTennisIcon />
              Games
            </div>
          </NavLink>

          <div className="navItem">
            {activeDm === true ? (
              <React.Fragment>
                <ArrowDropDownIcon
                  sx={{
                    "&:hover": { backgroundColor: "grey" },
                    borderRadius: "10%",
                  }}
                  onClick={() => setActiveDm(!activeDm)}
                />
                Direct Messages
                <DirectChatTable />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <ArrowRightIcon
                  sx={{
                    "&:hover": { backgroundColor: "grey" },
                    borderRadius: "10%",
                  }}
                  onClick={() => {
                    setActiveDm(!activeDm);
                    dispatch(fetchDirectChats());
                  }}
                />
                Direct Messages
              </React.Fragment>
            )}
          </div>

          <div className="navItem">
            {activeChannels === true ? (
              <React.Fragment>
                <ArrowDropDownIcon
                  sx={{
                    "&:hover": { backgroundColor: "grey" },
                    borderRadius: "10%",
                  }}
                  onClick={() => setActiveChannels(!activeChannels)}
                />
                Channels
                <GroupChatTable />
                <div className="navItemHiglight">
                  <ChatCreateModal />
                </div>
                <JoinChannel setJoinableChats={setJoinChannel} />
              </React.Fragment>
            ) : (
              <React.Fragment>
                {/* <div className="navItem"> */}
                <ArrowRightIcon
                  sx={{
                    "&:hover": { backgroundColor: "grey" },
                    borderRadius: "10%",
                  }}
                  onClick={() => setActiveChannels(!activeChannels)}
                />
                Channels
                {/* </div> */}
              </React.Fragment>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Menu;
