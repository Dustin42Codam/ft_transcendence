import Wrapper from "../../components/Wrapper";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Channel } from "../../models/Channel";

const fetchDataCall = async (page: any) => {
  let data = await axios
    .get(`chatrooms?page=${page}`)
    .then(async function (response) {
      return response;
    })
    .catch(function (error) {
      console.log(error);
    });
  return data;
};

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      let response: any = await fetchDataCall(page);

      setChannels(response.data.data);
      setLastPage(response.data.meta.last_page);
    };

    fetchData();
  }, [page]);

  const next = () => {
    if (page < lastPage) setPage(page + 1);
  };

  const prev = () => {
    if (page > 1) setPage(page - 1);
  };

  const deleteChannel = async (id: number) => {
    if (window.confirm("Are you sure to delete this channel?")) {
      await axios.delete(`chatrooms/${id}`);

      setChannels(channels.filter((u: Channel) => u.id !== id));
    }
  };

  return (
    <Wrapper>
      <div className="pt-3 pb-2 mb-3 border-bottom">
        <Link
          to="/channels/create"
          className="btn btn-sm btn-outline-secondary"
        >
          Add
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">Channel Name</th>
              <th scope="col">Type</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((channel: Channel) => {
              return (
                <tr key={channel.id}>
                  <td>{channel.name}</td>
                  <td>{channel.type}</td>
                  <td>
                    <div className="btn-group">
                      <a
                        href="#"
                        className="btn btn_delete"
                        onClick={() => deleteChannel(channel.id)}
                      >
                        Delete
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <nav>
        <ul className="pagination">
          <li className="page-item">
            <a href="#" className="page-link" onClick={prev}>
              Previous
            </a>
          </li>
          <li className="page-item">
            <a href="#" className="page-link" onClick={next}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </Wrapper>
  );
};

export default Channels;
