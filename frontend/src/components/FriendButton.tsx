import axios from "axios";
import React, { useEffect, useState } from "react";

const AddFriend = () => {
  return <button className="btn btn-outline-primary px-4">Add Friend</button>;
};

const RemoveFriend = () => {
  return (
    <button className="btn btn-outline-primary px-4">Remove Friend</button>
  );
};

const CancelFriendRequest = () => {
  return (
    <button className="btn btn-outline-primary px-4">
      Cancel Friend Request
    </button>
  );
};

const DeclineFriendRequest = () => {
  return (
    <button className="btn btn-outline-primary px-4">
      Decline Friend Request
    </button>
  );
};

export const FriendButton = (props: {
  friends: any;
  currentUser: any;
  userId: number;
  onClick: any;
}) => {
  const [friendRequest, setFriendRequest] = useState([]);

  async function fetchFriendRequest() {
    const response: any = await axios
      .get(`friendRequest/${props.userId}`) //TODO maybe remoce because this does not exist anymore right?
      .catch((err: any) => {
        console.log("🚀 ~ file: FriendButton ~ fetchFriendRequest ~ err", err);
      });

    setFriendRequest(response.data);
  }

  useEffect(() => {
    fetchFriendRequest();
  }, [props.userId]);

  const isFriend = props.friends.find(
    (friend: any) => friend.id === props.currentUser.id
  );

  let button;
  let text;

  if (isFriend) {
    // button = <RemoveFriend />;
    text = "+Remove Friend";
  } else if (friendRequest.length) {
    // button = <CancelFriendRequest />;
    text = "+Cancel";
  } else {
    // button = <AddFriend />;
    text = "+Add Friend";
  }

  return <button onClick={props.onClick}>{text}</button>;
};
