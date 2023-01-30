import React from 'react'
import { User } from '../../models/User'

function ChatBanUser(props: any) {
	console.log("🚀 ~ file: ChatBanUser.tsx:10 ~ ChatBanUser ~ props.user", props.user)
  return (
/* 	{
		
	} */
	<div>{props.user.display_name}</div>
  )
}

export default ChatBanUser