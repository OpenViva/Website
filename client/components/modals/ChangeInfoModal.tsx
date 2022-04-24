import React  from "react";
import { toast } from "react-toastify";
import { LocalUserPatchRequest, User } from "../../../types/api";
import useLocalUser from "../../hooks/useLocalUser";
import useOpen from "../../hooks/useOpen";
import FormIterator from "../../helpers/FormIterator";
import useAsyncCallback from "../../hooks/useAsyncCallback";
import requestJSON from "../../helpers/requestJSON";
import Button from "../Button";
import Field from "../Field";
import Modal, { ModalProps } from "./Modal";

interface FormData {
  username?: string;
  email?: string;
  newPassword?: string;
  password: string;
}

export default function ChangeInfoModal(props: ModalProps) {
  const { user, replaceUser } = useLocalUser();
  const { open, onOpen, onClose } = useOpen();
  
  const [onSubmit, loading] = useAsyncCallback(async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if(!user) return;
    
    if(!ev.currentTarget.checkValidity()) {
      ev.currentTarget.reportValidity();
      return;
    }
    
    const data = new FormIterator(ev.currentTarget).serialize<FormData>();
    
    if(!data.username || data.username === user?.username) data.username = undefined;
    if(!data.email || data.email === user?.email) data.email = undefined;
    if(!data.newPassword) data.newPassword = undefined;
    
    const newUser = await requestJSON<User, LocalUserPatchRequest>({
      pathname: "/api/localUser",
      method: "PATCH",
      data,
    });
    
    replaceUser(newUser);
    
    toast.success("Your information has been updated");
  }, [replaceUser, user]);
  
  if(!user) return props.trigger || null;
  
  return (
    <Modal open={open} onOpen={onOpen} onClose={onClose} {...props}>
      <form onSubmit={onSubmit}>
        <h3>Change Account Information</h3>
        <Field label="Username" name="username" placeholder="Your Name" fluid defaultValue={user.username} max={50} />
        <Field label="Email" name="email" placeholder="yourname@example.org" type="email" fluid defaultValue={user.email} max={50} />
        <Field label="New Password" type="password" name="newPassword" placeholder="(leave blank to keep current password)" fluid min={6} />
        <hr />
        <Field label="Old Password" type="password" name="password" placeholder="********" required fluid />
        <div className="actions">
          <Button onClick={onClose}>Cancel</Button>
          <Button primary loading={loading}>Change</Button>
        </div>
      </form>
    </Modal>
  );
}
