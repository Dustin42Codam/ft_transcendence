import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectUserById } from "../../redux/slices/usersSlice";
import Wrapper from "../../components/Wrapper";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Badge, Tab, Tabs } from "react-bootstrap";
import UserFriends from "../../components/UserFriends";
import axios from "axios";
import "./UserPage.css";
import { selectCurrentUser } from "../../redux/slices/currentUserSlice";
import UserStats from "../../components/UserStats";
import UserMatchHistory from "../../components/UserMatchHistory";
import { socketActions } from "../../redux/slices/socketSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "../../redux/store";
import GameLadder from "../../components/GameLadder";
import { ChatroomType, UserStatus } from "../../models/Channel";

export const UserPage = () => {
  const { userId } = useParams();
  const user = useAppSelector((state) => selectUserById(state, Number(userId)));
  const [friendship, setFriendship] = useState<any>({});
  const [isBlocked, setBlocked] = useState(false);
  const [friends, setFriends] = useState<any>([]);
  const currentUser: any = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let currentChatroom: any = store.getState().socket.currentChatRoom;
  const friendsAmount = "Friends (" + friends.length + ")";

  async function fetchBlocked() {
    await axios
      .get(`block/receiverId/${userId}`)
      .then(() => setBlocked(true))
      .catch(() => {
        setBlocked(false);
      });
  }

  async function fetchFriends() {
    const response: any = await axios
      .get(`friend/all/id/${userId}`)
      .catch((err: any) => {
        console.log("🚀 ~ file: UserPage.tsx ~ fetchFriends ~ err", err);
      });
    setFriends(response.data);
  }

  async function fetchFriendship() {
    const response = await axios
      .get(`friend/user/id/${userId}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("🚀 ~ file: UserPage.tsx ~ joinDM ~ error", error);
      });
    setFriendship(response);
  }

  useEffect(() => {
    if (currentUser.id === user.id) {
      navigate("/profile");
    }
    fetchFriendship();
    fetchBlocked();
    fetchFriends();
  }, [userId, friends.length]);

  async function addFriend() {
    await axios
      .post(`friend/add/id/${userId}`)
      .then(() => {
        toast.success(`Added ${user.display_name} as friend!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((error: any) => {
        toast.error(`Error: Failed to add ${user.display_name} as friend!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        console.log("🚀 ~ file: UserPage.tsx ~ addFriend ~ error", error);
      });
    fetchFriends();
  }

  async function removeFriend() {
    await axios
      .post(`friend/remove/id/${userId}`)
      .then(() => {
        toast.success(`Removed ${user.display_name} as friend!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((error: any) => {
        toast.error(`Error: Failed to remove ${user.display_name} as friend!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        console.log("🚀 ~ file: UserPage.tsx ~ removeFriend ~ error", error);
      });
    fetchFriends();
  }

  async function blockUser() {
    await axios
      .post(`block/add/receiverId/${userId}`)
      .then(() => {
        toast.success(`Blocked ${user.display_name}!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((error: any) => {
        toast.error(`Error: Failed to block ${user.display_name}!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        console.log("🚀 ~ file: UserPage.tsx ~ blockUser ~ error", error);
      });
    fetchFriends();
    setBlocked(true);
  }

  async function unblockUser() {
    await axios
      .post(`block/remove/receiverId/${userId}`)
      .then(() => {
        toast.success(`Unblocked ${user.display_name}!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      })
      .catch((error: any) => {
        toast.error(`Error: Failed to unblock ${user.display_name}!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        console.log("🚀 ~ file: UserPage.tsx ~ unblockUser ~ error", error);
      });
    fetchFriends();
    setBlocked(false);
  }

  async function joinDM() {
    dispatch(
      socketActions.joinARoom({
        chatRoom: {
          userId: user.id,
          id: friendship.chatroom_id,
          name: user.display_name,
          type: ChatroomType.DIRECT,
        },
      })
    );

    await new Promise((resolve, reject) => {
      const interval = setInterval(function () {
        currentChatroom = store.getState().socket.currentChatRoom;
        if (currentChatroom.id != -1) {
          resolve(null);
          clearInterval(interval);
        }
      }, 100);
    });

    navigate("../chats/dm/" + user.display_name, {
      replace: true,
      state: user.display_name,
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
                      {
                        user.status === UserStatus.OFFLINE && (
                        <span className="bg-secondary p-1 px-3 rounded text-white">
                          <Badge pill bg="secondary">
                            {user.status}
                          </Badge>
                        </span>)
                      }   
                      {
                        user.status === UserStatus.ONLINE && (
                        <span className="bg-success p-1 px-3 rounded text-white">
                          <Badge pill bg="success">
                            {user.status}
                          </Badge>
                        </span>)
                      }   
                      {
                        user.status === UserStatus.IN_A_GAME && (
                          <span className="bg-primary p-1 px-3 rounded">
                          <Badge pill bg="primary">
                            {user.status}
                          </Badge>
                        </span>)
                      }
                    <h5 className="mt-3">{user.display_name}</h5>

                    <div className="mt-2 buttons button-layout">
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
                        disabled={isBlocked || !friendship}
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
              <Tab eventKey="friends" title={friendsAmount}>
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
