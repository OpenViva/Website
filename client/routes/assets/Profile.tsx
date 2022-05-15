import React from "react";
import Button from "../../components/Button";
import useLocalUser from "../../hooks/useLocalUser";
import LoginModal from "../../components/modals/LoginModal";
import RegisterModal from "../../components/modals/RegisterModal";
import Field from "../../components/Field";
import ChangeInfoModal from "../../components/modals/ChangeInfoModal";
import Segment from "../../components/Segment";
import UploadModal from "../../components/modals/UploadModal";
import ManageUsers from "../../components/modals/ManageUsers";
import "./Profile.scss";

export default function Profile() {
  const { user, logout } = useLocalUser();
  
  if(user) {
    return (
      <Segment className="Profile">
        Welcome {user.username}.
        <Field label="Your email">{user.email}</Field>
        <Field label="Creation date">{new Date(user.created).toLocaleDateString()}</Field>
        <div className="links">
          {user.admin && <><ManageUsers trigger={<a href="#">Manage Users</a>} /><br /></>}
          <ChangeInfoModal trigger={<a href="#">Change Account Information</a>} /><br />
          <a href="#" onClick={logout}>Log Out</a><br />
        </div>
        <UploadModal trigger={<Button fluid primary>Upload Content</Button>} />
      </Segment>
    );
  } else {
    return (
      <Segment className="Profile">
        <p>
          You are not logged in.
        </p>
        <LoginModal trigger={<Button primary>Log in</Button>} /><br />
        <RegisterModal trigger={<Button primary>Register</Button>} />
      </Segment>
    );
  }
}
