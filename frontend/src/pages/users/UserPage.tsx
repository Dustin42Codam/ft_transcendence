import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectUserById } from "../../redux/slices/usersSlice";
import Wrapper from "../../components/Wrapper";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Tab, Tabs } from "react-bootstrap";
import UserFriends from "../../components/UserFriends";
import axios from "axios";
import "./UserPage.css";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import { FriendButton } from "../../components/FriendButton";
import UserStats from "../../components/UserStats";
import UserMatchHistory from "../../components/UserMatchHistory";
import { socketActions } from "../../redux/slices/socketSlice";
import { selectDirectChats } from "../../redux/slices/chatsSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "../../redux/store";
import GameLadder from "../../components/GameLadder";

export const UserPage = () => {
  const { userId } = useParams();
  const user = useAppSelector((state) => selectUserById(state, Number(userId)));

  const [friends, setFriends] = useState<any>([]);
  const [friendRequests, setFriendRequests] = useState<any>([]);
  const [isBlocked, setBlocked] = useState(false);
  const currentUser: any = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const dm_id = useAppSelector(selectDirectChats);
  const navigate = useNavigate();
  let currentChatroom: any = store.getState().socket.currentChatRoom;

  async function fetchFriendRequests() {
    const response: any = await axios
      .get(`friendRequest/my/all`)
      .catch((err: any) => {
        console.log(
          "🚀 ~ file: UserPage.tsx:29 ~ fetchFriendRequests ~ err",
          err
        );
      });
    setFriendRequests(response.data);
  }

  async function fetchBlocked() {
    const response: any = await axios
      .get(`block/${userId}`)
      .then((res: any) => (res.data ? setBlocked(true) : setBlocked(false)))
      .catch((err: any) => {
        console.log("🚀 ~ file: UserPage.tsx:29 ~ fetchBlocked ~ err", err);
      });
  }

  async function fetchFriends() {
    const response: any = await axios
      .get(`friend/user/${userId}`)
      .catch((err: any) => {
        console.log("🚀 ~ file: UserPage.tsx:29 ~ fetchFriends ~ err", err);
      });
    setFriends(response.data);
  }

  useEffect(() => {
    if (currentUser.id === user.id) {
      navigate("/profile");
    }
    fetchFriends();
    fetchFriendRequests();
    fetchBlocked();
  }, [userId]);

  async function addFriend() {
    await axios.post(`friend/${userId}`).catch((error: any) => {
      console.log("🚀 ~ file: UserPage.tsx ~ addFriend ~ error", error);
    });
    fetchFriends();
  }

  async function removeFriend() {
    await axios.post(`friend/remove/${userId}`).catch((error: any) => {
      console.log("🚀 ~ file: UserPage.tsx ~ removeFriend ~ error", error);
    });
    fetchFriends();
  }

  async function blockUser() {
    await axios
      .post(`block`, {
        receiver: {
          id: userId,
        },
      })
      .catch((error: any) => {
        console.log("🚀 ~ file: UserPage.tsx ~ blockUser ~ error", error);
      });
    fetchFriends();
    setBlocked(true);
  }

  async function unblockUser() {
    await axios.post(`block/${userId}`).catch((error: any) => {
      console.log("🚀 ~ file: UserPage.tsx ~ unblockFriend ~ error", error);
    });
    fetchFriends();
    setBlocked(false);
  }

  async function joinDM() {
    const friendship = await axios
      .get(`friend/this/${userId}`)
      .then((response) => {
        console.log(
          "🚀 ~ file: UserPage.tsx:151 ~ joinDM ~ response",
          response
        );
        return response.data;
      })
      .catch((error) => {
        console.log("🚀 ~ file: UserPage.tsx:141 ~ joinDM ~ error", error);
        return;
      });

    dispatch(
      socketActions.joinARoom({
        chatRoom: {
          id: friendship.chatroom_id,
          name: "dm",
        },
      })
    );
    const id = toast.loading(`joining room: ${friendship.chatroom_id}!`);
    await new Promise((resolve, reject) => {
      const interval = setInterval(function () {
        currentChatroom = store.getState().socket.currentChatRoom;
        if (currentChatroom.id != -1) {
          console.log("All goooed:", currentChatroom);
          resolve(null);
          clearInterval(interval);
        }
      }, 100);
    });
    toast.update(id, {
      render: `joined room: ${friendship.chatroom_id}!`,
      autoClose: 1500,
      type: "success",
      isLoading: false,
    });

    navigate("../chats/" + friendship.chatroom_id, {
      replace: true,
      state: friendship.chatroom_id,
    });
  }

  return (
    <Wrapper>
      <link
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <section id="content" className="container UserBody">
        <div className="page-heading">
          <div className="container mt-5">
            <div className="row d-flex justify-content-center">
              <div className="col-md-7">
                <div className="card p-3 py-4">
                  <div className="text-center">
                    <img
                      src={user.avatar}
                      width="200"
                      className="rounded-circle"
                    />
                  </div>

                  <div className="text-center mt-3">
                    <span className="bg-secondary p-1 px-3 rounded text-white">
                      {user.status}
                    </span>
                    <h5 className="mt-3">{user.display_name}</h5>

                    <div
						className="mt-2 buttons button-layout"

					>
                      {/* <FriendButton
                        friends={friends}
                        currentUser={currentUser}
                        userId={Number(userId)}
                        onClick={addFriend}
                      ></FriendButton> */}
                      {friends.find(
                        (friend: any) => friend.id === currentUser.id
                      ) ? (
                        <button
                          className="btn btn-outline-primary px-4"
                          onClick={removeFriend}
                        >
                          {" "}
                          Remove Friend{" "}
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-primary px-4"
                          onClick={addFriend}
                          disabled={isBlocked}
                        >
                          {" "}
                          Add Friend{" "}
                        </button>
                      )}{" "}
                      {isBlocked === false ? (
                        <button
                          className="btn btn-outline-primary px-4"
                          onClick={blockUser}
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-primary px-4"
                          onClick={unblockUser}
                        >
                          Unblock
                        </button>
                      )}{" "}
                      <button
                        className="btn btn-outline-primary px-4"
                        disabled={isBlocked}
                      >
                        Send Game Invite
                      </button>{" "}
                      <button
                        className="btn btn-outline-primary px-4"
                        onClick={joinDM}
                        disabled={isBlocked}
                      >
                        Message
                      </button>{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Tabs
              defaultActiveKey="friends"
              id="justify-tab-example"
              className="mb-3"
              justify
            >
              <Tab eventKey="friends" title="Friends">
                <UserFriends userId={Number(userId)} userFriends={friends} />
              </Tab>
              <Tab eventKey="match-history" title="Match History">
                <UserMatchHistory user={user}></UserMatchHistory>
              </Tab>
              <Tab eventKey="stats" title="Stats">
                <UserStats userStats={user.game_stats}></UserStats>
              </Tab>
              <Tab eventKey="ladder" title="Ladder">
                <GameLadder displayedUser={user}></GameLadder>
              </Tab>
            </Tabs>
          </div>
        </div>
      </section>
    </Wrapper>
  );
};
