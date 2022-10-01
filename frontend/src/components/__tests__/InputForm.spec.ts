import { vi, describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ChatInput from "../ChatInput.vue";

import axios from "axios";

vi.mock("axios");

describe("ChatInput", () => {
  it("renders properly", () => {
    const wrapper = mount(LoginForm);
  });
  it("api call works", async () => {
    const wrapper = mount(LoginForm);
    axios({
      method: "post",
      url: "http://backend:3000/",
      data:{
        username: "test@gmail.com",
        password: "password"
      }
    })
  });
});
