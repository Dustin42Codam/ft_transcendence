import { User } from "../../models/User";

export const setUser = (user: User) => {
  return {
    type: "SET_USER",
    user: user,
  };
};
