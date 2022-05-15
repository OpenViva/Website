import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { VerifyEmailResponse } from "../../../types/api";
import usePageData from "../../hooks/usePageData";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [pageData] = usePageData<VerifyEmailResponse>();
  
  useEffect(() => {
    if(pageData?.verified) {
      toast.success("Your email account has been verified successfully. You can now log in.");
    } else {
      toast.error("There was an error while trying to verifying your email. Please contact site administrator.");
    }
    
    navigate("/assets", { replace: true });
  }, [navigate, pageData]);
  
  return (
    <div className="VerifyEmailPage">
      Redirecting...
    </div>
  );
}
