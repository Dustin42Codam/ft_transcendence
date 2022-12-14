import React from "react";
import { useAppSelector } from "../../redux/hooks";

export const PostCreator = ({ userId }: any) => {
  const creator = useAppSelector((state: any) =>
    state.users.users.find((user: any) => user.id == userId)
  );

  return <span>by {creator ? creator.display_name : "Unknown creator"}</span>;
};
