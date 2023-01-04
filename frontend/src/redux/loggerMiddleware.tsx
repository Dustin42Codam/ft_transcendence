import { Middleware } from "redux";
const loggerMiddleware: Middleware = (store) => {
  return (next) => {
    return (action) => {
      console.log("dispatching", action);
      const result = next(action);
      console.log("next state", store.getState());
      return result;
    };
  };
};
export default loggerMiddleware;
