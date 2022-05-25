import React, { ReactComponentElement, ReactElement, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,

} from "@apollo/client";
import { useCreateMessageMutation, useCreateUserMutation, useGetAllUsersQuery, useGetUserMessagesQuery } from "./generated/graphql";

const client = new ApolloClient({
  uri: "https://users-messages-gql.herokuapp.com/graphql",
  cache: new InMemoryCache(),
});

// useGetUserMessagesQuery
// useCreateMessageMutation
// useCreateUserMutation
// useGetAllUsersQuery
interface User {
  username?: String
  first_name?: String
  last_name?: String
  messages?: [Messages]
}



function GetUsers() {
  const { loading, error, data } = useGetAllUsersQuery();
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;
  return (
    <div>
      {data?.users?.map((user:User) => (
        <div>{user.username}</div>
      ))}
    </div>
  );
}

//  const ADD_USER = gql`
//  mutation CreateUser($username: ID!, $first_name: String!, $last_name: String!) {
// createUser(username: $username, first_name: $first_name, last_name: $last_name) {
//  username
//  first_name
//  last_name
// }
// }
//  `

//  const ADD_MESSAGE = 
//  gql`
//  mutation CreateMessage($username: ID!, $body: String!) {
// createMessage(username: $username, body: $body) {
//  id
//  body
//  user {
//    username
//  }
// }
// }`


//  const GET_MESSAGES =  gql`
//  query getAllUsers {
// users {
//  username
//  first_name
//  last_name
// }
// }
//  `
function AddUser() {

  const initialFormData = {
    usernameInput : "",
    firstNameInput : "",
    lastNameInput : ""
  }

  const [formData, setFormData] = useState(initialFormData)

  const [addUser, { data, loading, error }] = useCreateUserMutation();

  // if (loading) return 'Submitting...';
  // if (error) {
  //   return `Submission error! ${error.message}`;
  // }

  function handleSubmit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addUser({
      variables: {
        username: formData.usernameInput,
        first_name: formData.firstNameInput, last_name: formData.lastNameInput
      }
    });
    setFormData(initialFormData);
  }

  function handleChange(event:React.ChangeEvent<HTMLInputElement>) {
    const {name, value} = event.target;

    setFormData(fData => ({...fData, [name] : value}))
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Add New User</h2>
        <input
          onChange={handleChange}
          value={formData.usernameInput}
          name="usernameInput"
          placeholder="username"
        />
        <input
          onChange={handleChange}
          value={formData.firstNameInput}
          name="firstNameInput"
          placeholder="first name"
        />
        <input
          onChange={handleChange}
          value={formData.lastNameInput}
          name="lastNameInput"
          placeholder="last name"
        />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
}


function AddMessage() {

  const initialFormData = {
    usernameInput : "",
    bodyInput : ""
  }

  const [formData, setFormData] = useState(initialFormData)

  const [addUser, { data, loading, error }] = useCreateMessageMutation();

  // if (loading) return 'Submitting...';
  // if (error) {
  //   return `Submission error! ${error.message}`;
  // }

  function handleSubmit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addUser({
      variables: {
        username: formData.usernameInput,
        body: formData.bodyInput
      }
    });
    setFormData(initialFormData);
  }

  function handleChange(event:React.ChangeEvent<HTMLInputElement>) {
    const {name, value} = event.target;

    setFormData(fData => ({...fData, [name] : value}))
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Add New Message</h2>
        <input
          onChange={handleChange}
          value={formData.usernameInput}
          name="usernameInput"
          placeholder="username"
        />
        <input
          onChange={handleChange}
          value={formData.bodyInput}
          name="bodyInput"
          placeholder="message body"
        />
        <button type="submit">Add Message</button>
      </form>
    </div>
  );
}



interface Messages {
  id? : String
  body?: String
}
interface username {
  username: string
}

function GetMessages({ username }:username) {
  const { loading, error, data } = useGetUserMessagesQuery( {
    variables: { username },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;
  return (
    <div>
      {data?.user?.messages?.map((message:Messages) => (
        <div>{message.body}</div>
      ))}
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ApolloProvider client={client}>

  <React.StrictMode>
    <App />
  </React.StrictMode>
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export { GetUsers, GetMessages, AddUser, AddMessage };
