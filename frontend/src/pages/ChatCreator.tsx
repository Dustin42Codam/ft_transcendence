import React from "react";
import { useAppSelector } from "../redux/hooks";

export const ChatCreator = ({ userId }: any) => {
  const creator = useAppSelector((state) =>
    state.users.find((user) => user.id === userId)
  );

  return <span>by {creator ? creator.name : "Unknown creator"}</span>;
};
