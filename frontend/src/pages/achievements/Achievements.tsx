import axios from "axios";
import React, { useEffect, useState } from "react";
import Wrapper from "../../components/Wrapper";
import { MockAchievements } from "../../mockdata/achievements";
import Achievement from "../../models/Achievement";
import Avatar from "@mui/material/Avatar";
import Paginator from "../../components/Paginator";

const fetchDataCall = async () => {
  let response = await axios.get(`achievements`).catch(function (error) {
    console.log(
      "🚀 ~ file: Achievements.tsx ~ line 8 ~ fetchDataCall ~ error",
      error
    );
  });
  return response;
};

const Achievements = () => {
  //   const [achievements, setAchievements] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const mock: any = MockAchievements;

  useEffect(() => {
    // Note: wait until backend has a table for achievements
    // const fetchData = async () => {
    //   const response = await fetchDataCall();
    //   setAchievements(response.data.achievements);
    // };
    // fetchData();
  }, []);

  return (
    <Wrapper>
      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Image</th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {mock.map((a: Achievement) => {
              return (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>
                    <Avatar
                      src={a.image}
                      sx={{ height: "70px", width: "70px" }}
                    ></Avatar>
                  </td>
                  <td>{a.title}</td>
                  <td>{a.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Paginator lastPage={lastPage} pageChanged={setPage} page={page}/>
    </Wrapper>
  );
};

export default Achievements;
