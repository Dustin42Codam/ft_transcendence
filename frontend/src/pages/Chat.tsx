import React, { Component } from "react";
import Wrapper from "../components/Wrapper";

export enum ChatroomType {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  PRIVATE = 'private',
  DIRECT = 'direct'
}

type Messages = {
  content: string;
  date: Date;
  type: ChatroomType;
};

type Chats = {
  name: string;
  type: ChatroomType;
};

export default class Chat extends Component {
/*
  state = {
    this.state =
  }
  constructor(props: any) {
    super(props);

    componentDidMount() {
    fetch('https://localhost:3000/api/aye')
      .then(response => response.json())
      .then(json => {
        this.setState({ jsonReturnedValue: json });
    });
  }
*/
  render() {
    return (
      <Wrapper>
        <div className="table-responsive">Chats</div>
      </Wrapper>
    );
  }
}
