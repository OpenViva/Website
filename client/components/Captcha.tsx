import React  from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useConfig } from "../hooks/usePageData";
import Field from "./Field";
import Loader from "./Loader";
import "./Captcha.scss";

type CaptchaProps = Partial<React.ComponentProps<typeof HCaptcha>>;

export default function Captcha(props: CaptchaProps) {
  const { hcaptchaSiteKey } = useConfig();
  
  if(hcaptchaSiteKey) {
    return (
      <Field center className="Captcha">
        <Loader size={350} />
        <HCaptcha sitekey={hcaptchaSiteKey} {...props} />
      </Field>
    );
  } else return null;
}
