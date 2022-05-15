import React, { useCallback, useEffect, useState } from "react";
import { UserUpdateRequest, User, UsersSearchRequest, UsersSearchResponse } from "../../../types/api";
import requestJSON from "../../helpers/requestJSON";
import useOpen from "../../hooks/useOpen";
import CheckButton from "../CheckButton";
import Field from "../Field";
import Modal, { ModalProps } from "./Modal";
import "./ManageUsers.scss";


export default function ManageUsers(props: ModalProps) {
  const { open, onOpen, onClose } = useOpen();
  const [text, setText] = useState("");
  const [banned, setBanned] = useState<null | boolean>(null);
  const [verified, setVerified] = useState<null | boolean>(null);
  const [users, setUsers] = useState<User[]>([]);
  
  const onTextChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => setText(ev.currentTarget.value), []);
  
  const refreshUsers = useCallback(async () => {
    const users = await requestJSON<UsersSearchResponse, UsersSearchRequest>({
      url: "/api/users",
      search: {
        text: !text ? undefined : text,
        banned: banned === null ? undefined : banned,
        verified: verified === null ? undefined : verified,
      },
    });
    
    setUsers(users);
  }, [banned, text, verified]);
  
  useEffect(() => {
    if(open) refreshUsers().catch(console.error);
  }, [open, refreshUsers]);
  
  return (
    <Modal className="ManageUsers" open={open} onOpen={onOpen} onClose={onClose} {...props}>
      <h3>Manage Users</h3>
      <Field>
        <input placeholder="Search..." value={text} onChange={onTextChange} />
        <CheckButton text="Verified" triState checked={verified} onChange={setVerified} />
        <CheckButton text="Banned" triState checked={banned} onChange={setBanned} />
      </Field>
      <div className="users">
        {users.map(user => <UserRow key={user.id} user={user} refreshUsers={refreshUsers} />)}
      </div>
    </Modal>
  );
}

interface UserProps {
  user: User;
  refreshUsers: () => void;
}

function UserRow({ user, refreshUsers }: UserProps) {
  const toggleProperty = useCallback(async (ev: React.MouseEvent, name: "banned" | "verified" | "admin") => {
    ev.preventDefault();
    
    await requestJSON<any, UserUpdateRequest>({
      url: `/api/users/${user.id}`,
      method: "PATCH",
      data: {
        [name]: !user[name],
      },
    });
    
    refreshUsers();
  }, [user, refreshUsers]);
  
  const onVerify = useCallback(async (ev: React.MouseEvent) => toggleProperty(ev, "verified"), [toggleProperty]);
  const onBan = useCallback(async (ev: React.MouseEvent) => toggleProperty(ev, "banned"), [toggleProperty]);
  const onAdmin = useCallback(async (ev: React.MouseEvent) => toggleProperty(ev, "admin"), [toggleProperty]);
  
  return (
    <div className="UserRow">
      <span className="username">{user.username}</span>&ensp;
      <span className="email">&lt;{user.email}&gt;</span>&ensp;
      <span className="ip">({user.lastLoginIp})</span>
      <div className="spacer" />
      {!user.verified && <a href="#" className="verify" onClick={onVerify}>Verify</a>}
      {user.verified && <a href="#" className="unverify" onClick={onVerify}>Unverify</a>}
      &ensp;|&ensp;
      {!user.banned && <a href="#" className="ban" onClick={onBan}>Ban</a>}
      {user.banned && <a href="#" className="unban" onClick={onBan}>Unban</a>}
      &ensp;|&ensp;
      {!user.admin && <a href="#" className="admin" onClick={onAdmin}>Admin</a>}
      {user.admin && <a href="#" className="unadmin" onClick={onAdmin}>Unadmin</a>}
    </div>
  );
}

