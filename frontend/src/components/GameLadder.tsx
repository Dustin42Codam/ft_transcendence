import { Avatar } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { selectCurrentUser } from '../redux/slices/currentUserSlice';
import "./GameLadder.css"

function GameLadder(props: {displayedUser: any}) {
	const [ladder, setLadder] = useState<any>([]);
	const currentUser = useAppSelector(selectCurrentUser);

	async function fetchLadder() {
		const response: any = await axios
		  .get(`game/get/ladder`)
		  .catch((err: any) => {
		  	console.log("🚀 ~ file: GameLadder.tsx:11 ~ fetchLadder ~ err", err)
		  });
		console.log("🚀 ~ file: GameLadder.tsx:13 ~ fetchLadder ~ response", response)
		setLadder(response.data);
	}

	useEffect(() => {
		fetchLadder();
	}, [])

	return (
		<table className="table table-striped table-dark">
			<thead>
				<tr>
				<th scope="col">#</th>
				<th scope="col"></th>
				<th scope="col">Name</th>
				<th scope="col">Wins</th>
				<th scope="col">Losses</th>
				</tr>
			</thead>
			{ladder.map((user: any, id: number) => (
				<tbody key={user.id} style={{color: 'red'}}>

					<tr className={props.displayedUser.display_name === user.display_name ? "table-secondary" : "table-dark"}>
						<th scope="row">{id+1}</th>
						<td>
							<Avatar
								alt={user.display_name}
								src={user.avatar}
							/>
						</td>
						<td>
							<Link
								to={
									user.id === currentUser.id
									//   ? "/profile"
									? `/profile`
									: `/users/${user.id}`
								}
								style={{ textDecoration: "inherit", color: "inherit" }}
							>
								{user.display_name}
							</Link>
						</td>
						<td>{user.game_stats.win}</td>
						<td>{user.game_stats.lose}</td>
					</tr>
				</tbody>
			))}
		</table>
	)
}

export default GameLadder
