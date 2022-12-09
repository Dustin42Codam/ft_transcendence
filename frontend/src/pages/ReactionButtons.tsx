import React from 'react'
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { reactionAdded } from '../redux/chat/chatsSlice';

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀'
}

export const ReactionButtons = ({ message }: any) => {
	const dispatch = useAppDispatch();
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
	  	key={name}
		type="button"
		className="muted-button reaction-button"
		onClick={() =>
			dispatch(reactionAdded({messageId: message.id, reaction: name}))
		}
		>
		{emoji} {message.reactions[name]}
      </button>
    )
  })

  return <div>{reactionButtons}</div>
}
