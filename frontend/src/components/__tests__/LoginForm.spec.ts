import { vi, describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import LoginForm from "../LoginForm.vue";
import axios from "axios";

vi.mock("axios");

describe("LoginForm", () => {
  it("renders properly", () => {
    const wrapper = mount(LoginForm);
    expect(wrapper.html()).toContain("Submit");
    expect(wrapper.html()).toContain("Your Intra Password:");
    expect(wrapper.html()).toContain("Intra Email address:");
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
