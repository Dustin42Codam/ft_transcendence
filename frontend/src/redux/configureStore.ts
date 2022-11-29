import { createStore, applyMiddleware } from "redux";
import { setUserReducer } from "./reducers/setUserReducer";
import { logger } from "redux-logger";

export const configureStore = () => {
  return createStore(setUserReducer, applyMiddleware(logger));
};
