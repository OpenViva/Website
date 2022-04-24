import React  from "react";
import useOpen from "../../hooks/useOpen";
import Field from "../Field";
import Button from "../Button";
import FormIterator from "../../helpers/FormIterator";
import useLocalUser from "../../hooks/useLocalUser";
import useAsyncCallback from "../../hooks/useAsyncCallback";
import Modal, { ModalProps } from "./Modal";

interface FormData {
  email: string;
  password: string;
}

export default function LoginModal(props: ModalProps) {
  const { login } = useLocalUser();
  const { open, onOpen, onClose } = useOpen();
  
  const [onSubmit, loading] = useAsyncCallback(async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    
    if(!ev.currentTarget.checkValidity()) {
      ev.currentTarget.reportValidity();
      return;
    }
    
    const data = new FormIterator(ev.currentTarget).serialize<FormData>();
    await login(data.email, data.password);
    
    onClose();
  }, [login, onClose]);
  
  return (
    <Modal open={open} onOpen={onOpen} onClose={onClose} {...props}>
      <form onSubmit={onSubmit}>
        <h3>Login</h3>
        <Field label="Email" name="email" placeholder="youremail@example.org" required fluid />
        <Field label="Password" type="password" name="password" placeholder="********" required fluid />
        <div className="actions">
          <Button onClick={onClose}>Cancel</Button>
          <Button primary loading={loading}>Login</Button>
        </div>
      </form>
    </Modal>
  );
}

