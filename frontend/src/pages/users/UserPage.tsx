import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { selectAllUsers, selectUserById } from "../../redux/slices/usersSlice";
import Wrapper from "../../components/Wrapper";
import {
  fetchFriends,
  selectAllFriends,
} from "../../redux/slices/friendsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

export const UserPage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const userId = params.userId;

  const user = useSelector((state) => selectUserById(state, userId));
  const friendsStatus = useAppSelector((state) => state.friends.status);
  const friends = useAppSelector(selectAllFriends);

  useEffect(() => {
    if (friendsStatus === "idle") dispatch(fetchFriends());
  }, [friendsStatus, dispatch]);

  const renderedFriends = friends.map((friend: any) => (
    <li key={friend.id}>
      {/* <Link to={`/user/${friend.id}`}>{friend.display_name}</Link> */}
      {friend.id}
    </li>
  ));

  return (
    <Wrapper>
      <section>
        <h2>{user.display_name}</h2>
        Friends:
        <ul>{renderedFriends}</ul>
      </section>
    </Wrapper>
  );
};
