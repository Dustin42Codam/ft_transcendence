import React from "react";
import { useAppSelector } from "../../redux/hooks";

export const PostCreator = ({ userId }: any) => {
  const creator = useAppSelector((state) =>
    state.users.find((user) => user.id == userId)
  );

  return <span>by {creator ? creator.display_name : "Unknown creator"}</span>;
};
