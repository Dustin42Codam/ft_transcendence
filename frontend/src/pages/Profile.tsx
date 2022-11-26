import { accordionSummaryClasses } from "@mui/material";
import axios from "axios";
import React, { Component, SyntheticEvent, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";
import Wrapper from "../components/Wrapper";

const fetchDataCall = async () => {
  let response = await axios.get(`user`).catch(function (error) {
    console.log(
      error
    );
  });
  return response;
};

const Profile = () => {
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [status, setStatus] = useState("offline");
    const [twoFA, setTwoFA] = useState("false");
    const [redirect, setRedirect] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const fetchData = async () => {
        const response: any = await fetchDataCall();
        setName(response.data.display_name);
        setAvatar(response.data.avatar);
        setStatus(response.data.status);
        setTwoFA(response.data.twoFA);
      };
  
      fetchData();
    }, []);
  
    const infoSubmit = async (e: SyntheticEvent) => {
      e.preventDefault();
  
      const user: any = await axios.get('user');

      await axios
        .put(`users/${user.data.id}`, {
          display_name: name,
          avatar,
          status,
          two_factor_auth: twoFA,
        })
        .then(() => {
          console.log("success");
        })
        .catch((err) => {
          console.log(err);
        });
  
      setRedirect(true);
    };
  
    if (redirect) {
      return <Navigate to="/users" />;
    }


  const updateImage = (url: string) => {
    if (ref.current) {
      ref.current.value = url;
    }
    setAvatar(url);
  };

    return (
      <Wrapper>
      <h3>User Information</h3>
      <form onSubmit={infoSubmit}>
          <div className="mb-3">
              <label> Name</label>
              <input className="form-control"
                     defaultValue={name}
                     onChange={e => setName(e.target.value)}
              />
          </div>
          <div className="mb-3">
          <label>Avatar</label>
          <div>
            <input
              ref={ref}
              className="form-control"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
            <ImageUpload uploaded={updateImage} />
          </div>
        </div>

        <div className="mb-3">
          <label>Two Factor Authentication</label>
          <select
            className="form-control"
            value={twoFA}
            onChange={(e) => setTwoFA(e.target.value)}
          >
            <option key="false" defaultValue="false">
              false
            </option>
            <option key="true" value="true">
              true
            </option>
          </select>
        </div>

        <button className="btn btn-outline-secondary">Save</button>
      </form>
  </Wrapper>
    );
}

export default Profile;
