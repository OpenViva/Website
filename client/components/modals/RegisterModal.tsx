import React  from "react";
import { toast } from "react-toastify";
import { LocalUserRegisterRequest, LocalUserRegisterResponse } from "../../../types/api";
import useAsyncCallback from "../../hooks/useAsyncCallback";
import useOpen from "../../hooks/useOpen";
import FormIterator from "../../helpers/FormIterator";
import requestJSON from "../../helpers/requestJSON";
import Captcha from "../Captcha";
import Button from "../Button";
import Field from "../Field";
import Modal, { ModalProps } from "./Modal";

interface FormData {
  username: string;
  email: string;
  password: string;
}

export default function RegisterModal(props: ModalProps) {
  const { open, onOpen, onClose } = useOpen();
  
  const [unSubmit, loading] = useAsyncCallback(async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    
    if(!ev.currentTarget.checkValidity()) {
      ev.currentTarget.reportValidity();
      return;
    }
    
    const data: LocalUserRegisterRequest = new FormIterator(ev.currentTarget).serialize<FormData>();
    const { verified } = await requestJSON<LocalUserRegisterResponse, LocalUserRegisterRequest>({
      url: "/api/localUser/register",
      method: "POST",
      data,
    });
    
    if(verified) {
      toast.success("Your account has been created. You can now log in.");
    } else {
      toast.success("Your account has been created. Please check your email for confirmation link.");
    }
    
    onClose();
  }, [onClose]);
  
  return (
    <Modal open={open} onOpen={onOpen} onClose={onClose} {...props}>
      <form onSubmit={unSubmit}>
        <h3>Register New Account</h3>
        <Field label="Username" name="username" placeholder="Your Name" required fluid max={50} />
        <Field label="Email" name="email" placeholder="yourname@example.org" type="email" required fluid max={50} />
        <Field label="Password" type="password" name="password" placeholder="********" required fluid min={6} />
        <Captcha />
        <div className="actions">
          <Button onClick={onClose}>Cancel</Button>
          <Button primary loading={loading}>Register</Button>
        </div>
      </form>
    </Modal>
  );
}

