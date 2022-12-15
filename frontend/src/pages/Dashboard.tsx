import React, { useRef, useEffect, Component, useState } from "react";
import { io, Socket } from "socket.io-client";
import Wrapper from "../components/Wrapper";
import { fetchChats } from "../redux/chat/chatActions";

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
  const socketRef = useRef<Socket | null>(null);
  const [settings, setSettings] = useState(false);

  useEffect(() => {
    if (socketRef.current == null) {
      socketRef.current = io('ws://localhost:3000', {
					withCredentials: true,
					transports: ["websocket", "polling"],
			});
		}

    const {current: socket} = socketRef;

    try {
      socket.open();
      socket.emit("msgToServer", 'load settings');
      socket.on('msgRecivedToClient', (data) => {
        setSettings(data);
      })
    } catch (error) {
      console.log(error);
    }
    return () => {
      socket.close();
    };
  }, []);

  return (
    <Wrapper>
      <p>{settings}</p>
    </Wrapper>
	);
};
export default Dashboard;
