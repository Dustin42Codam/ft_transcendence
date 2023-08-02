import { Middleware } from "redux";
const loggerMiddleware: Middleware = (store) => {
  return (next) => {
    return (action) => {
      const result = next(action);
      return result;
    };
  };
};
export default loggerMiddleware;
