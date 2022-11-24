import Wrapper from "../../components/Wrapper";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { ChannelType, ChatroomType } from "../../models/Channel";
import axios from "axios";
import { Navigate } from "react-router-dom";

const ChannelCreate = () => {
  const [name, setName] = useState("");
  const [type, setTypeId] = useState("public");
  const [types, setTypes] = useState(ChatroomType);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {}, []);

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    await axios
      .post("chatrooms", {
        name,
        type,
      })
      .then(() => {
        console.log("sucess");
      })
      .catch((err) => {
        console.log(err);
      });

    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to="/channels" />;
  }

  return (
    <Wrapper>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label>Channel Name</label>
          <input
            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Channel Type</label>
          <select
            className="form-control"
            onChange={(e) => setTypeId(e.target.value)}
          >
            <option
              key={ChatroomType.PUBLIC}
              defaultValue={ChatroomType.PUBLIC}
            >
              public
            </option>
            <option key={ChatroomType.PRIVATE} value={ChatroomType.PRIVATE}>
              private
            </option>
            <option key={ChatroomType.PROTECTED} value={ChatroomType.PROTECTED}>
              protected
            </option>
          </select>
        </div>

        <button className="btn btn-outline-secondary">Save</button>
      </form>
    </Wrapper>
  );
};

export default ChannelCreate;
