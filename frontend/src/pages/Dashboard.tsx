import React, { useRef, useEffect, Component, useState } from "react";
import Wrapper from "../components/Wrapper";
import Snicel from "../components/Socket";

/*
const Dashboard = () => {
	const client = useRef<Socket | null>(null);
  const [newMsg, setNewMsg] = useState<string>("");

  useEffect(() => {
		if (client.current == null) {
		}
			/*
    const connectToServer = async () => {
      await new Promise<void>((resolve) => {
        client.on("connect", () => {
          setIsConnected(true), resolve();
        });
      });
    };
			client.current.on('connect', () => console.log(`Client connected: ${client.current!.id}`));

			client.current.on('disconnect', (reason) =>
				console.log(`Client disconnected: ${reason}`)
			);

			client.current.on('connect_error', (reason) =>
				console.log(`Client connect_error: ${reason}`)
			);

			function reciveMessage(msg: string) {
				client.current!.on('msgRecivedToClient', (data) => console.log("DATA", data));
			}

  });
	/*
	useEffect( () => {
		return  () => {
			console.log("unmount");
			client.current!.close();
		}
	}
	, []);


  function sendMessage(msg: string) {
    console.log(msg);
    client.current!.emit("msgToServer", msg);
	}
  //const ws = new WebSocket("ws://localhost:3000");
  return (
    <Wrapper>
      <input type="msg" onChange={(e) => setNewMsg(e.target.value)}></input>
      <button onClick={() => sendMessage(newMsg)}>Submit</button>
      <div>Dashboard</div>
    </Wrapper>
  );
};
*/
const Dashboard = () => {
  return (
    <Wrapper>
      <Snicel></Snicel>
    </Wrapper>
  );
};
export default Dashboard;
