import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { selectAllUsers, selectUserById } from '../../redux/slices/usersSlice'
import Wrapper from '../../components/Wrapper'

export const UserPage = () => {
	const params = useParams();
	const userId = params.id;

  const user = useSelector(state => selectUserById(state, userId))

  const friendsForUser = useSelector(state => {
    const allFriends = selectAllUsers(state) // change later to friends
    return allFriends.filter((friend: any) => friend.user === userId)
  })

  const renderedFriends = friendsForUser.map((friend: any) => (
    <li key={friend.id}>
      <Link to={`/user/${friend.id}`}>{friend.title}</Link>
    </li>
  ))

  return (
	<Wrapper>
		<section>
		<h2>{user.name}</h2>

		<ul>{renderedFriends}</ul>
		</section>
	</Wrapper>
  )
}
