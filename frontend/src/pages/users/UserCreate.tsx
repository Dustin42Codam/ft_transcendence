import React, { useState } from "react";
import Wrapper from "../../components/Wrapper";

const UserCreate = () => {
  const [displayName, setDisplayName] = useState("");

  const submit = async () => {
    console.log("Creating new user...");
  };

  return (
    <Wrapper>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <button className="btn btn-outline-secondary">Save</button>
      </form>
    </Wrapper>
  );
};

export default UserCreate;
