import { createStore, applyMiddleware } from "redux";
import { setUserReducer } from "./reducers/setUserReducer";
import { logger } from "redux-logger";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

export const configureStore = () => {
  return createStore(setUserReducer, applyMiddleware(logger));
};
