import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { selectUserById } from "../../redux/slices/usersSlice";
import Wrapper from "../../components/Wrapper";
import { useAppSelector } from "../../redux/hooks";
import { Button, Tab, Tabs } from "react-bootstrap";
import UserFriends from "../../components/UserFriends";
import { Avatar } from "@mui/material";
import axios from "axios";
import "./UserPage.css";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import { FriendButton } from "../../components/FriendButton";
import UserStats from "../../components/UserStats";
import UserMatchHistory from "../../components/UserMatchHistory";

export const UserPage = () => {
  const { userId } = useParams();
  const user = useAppSelector((state) => selectUserById(state, Number(userId)));

  const [friends, setFriends] = useState<any>([]);
  const [friendRequests, setFriendRequests] = useState<any>([]);
  const currentUser: any = useAppSelector(selectCurrentUser);

  async function fetchFriendRequests() {
    const response: any = await axios
      .get(`friendRequest/my/all`)
      .catch((err: any) => {
        console.log(
          "🚀 ~ file: UserPage.tsx:29 ~ fetchFriendRequests ~ err",
          err
        );
      });
    console.log(
      "🚀 ~ file: UserPage.tsx:28 ~ fetchFriendRequests ~ response",
      response
    );
    setFriendRequests(response.data);
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
    fetchFriends();
    fetchFriendRequests();
  }, [userId]);

  async function addFriend() {
    await axios.post(`friend/${userId}`).catch((error: any) => {
      console.log("🚀 ~ file: UserPage.tsx ~ addFriend ~ error", error);
    });
    fetchFriends();
  }

  async function blockUser() {
    await axios.post(`block`,
      {
        receiver: {
          id: userId
        }
      })
      .catch((error: any) => {
      console.log("🚀 ~ file: UserPage.tsx ~ blockUser ~ error", error);
    });
    fetchFriends();
  }

  async function removeFriend() {
    await axios.post(`friend/remove/${userId}`).catch((error: any) => {
      console.log("🚀 ~ file: UserPage.tsx ~ removeFriend ~ error", error);
    });
    fetchFriends();
  }

  async function unblockUser() {
    await axios.post(`block/${userId}`).catch((error: any) => {
      console.log("🚀 ~ file: UserPage.tsx ~ unblockFriend ~ error", error);
    });
    fetchFriends();
  }

  function printState() {
    console.log("🚀 ~ file: UserPage.tsx:19 ~ UserPage ~ friends", friends);
    console.log(
      "🚀 ~ file: UserPage.tsx:21 ~ UserPage ~ friendRequests",
      friendRequests
    );
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

                    <div className="mt-2 buttons">
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
                        >
                          {" "}
                          Add Friend{" "}
                        </button>
                      )}{" "}
                      <button 
                        className="btn btn-outline-primary px-4"
                        onClick={blockUser}
                      >
                        Block
                      </button>{" "}
                      <button 
                        className="btn btn-outline-primary px-4"
                        onClick={unblockUser}
                      >
                        Unblock
                      </button>{" "}
                      <button className="btn btn-outline-primary px-4">
                        Send Game Invite
                      </button>{" "}
                      <button className="btn btn-outline-primary px-4">
                        Message
                      </button>{" "}
                      <button
                        className="btn btn-outline-primary px-4"
                        onClick={printState}
                      >
                        Print State
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
                <UserMatchHistory
                  matchHistory={user.matches}
                ></UserMatchHistory>
              </Tab>
              <Tab eventKey="stats" title="Stats">
                <UserStats userStats={user.game_stats}></UserStats>
              </Tab>
              <Tab eventKey="achievements" title="Achievements" disabled></Tab>
            </Tabs>
          </div>
        </div>
      </section>
    </Wrapper>
  );
};
