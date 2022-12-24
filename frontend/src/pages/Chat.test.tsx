import Chat from "./Chat";
import React from "react";
import { render } from "@testing-library/react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../redux/store";

jest.mock("axios");
import axios from "axios";

describe("Testing baisic connections", () => {
  test("does the input box render when chat is loded", () => {
    /*
		const { chatPage } = render(<Provider store={store}><Chat /></Provider>, {wrapper: BrowserRouter}); //render is from @testing-library/react
		const chatInputBox = chatPage.getElementsByClassName("chatInputBox");
		expect(chatInputBox).toBeInTheDocument();	
	 */
  });
});
