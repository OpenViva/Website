import { load, ReCaptchaInstance } from 'recaptcha-v3';
import { useEffect, useState } from "react";
import { useConfig } from "./usePageData";
import useChange from "./useChange";

export default function useRecaptcha(active = true) {
  const { recaptchaSiteKey } = useConfig();
  const [recaptcha, setRecaptcha] = useState<ReCaptchaInstance | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(!active) return;
    
    let cancel = false;
    
    async function doIt() {
      if(!recaptchaSiteKey) return;
      setLoading(true);
      const recaptcha = await load(recaptchaSiteKey);
      
      if(cancel) return;
      setRecaptcha(recaptcha);
      setLoading(false);
    }
    
    doIt().catch(console.error);
    
    return () => {
      cancel = true;
    };
  }, [active, recaptchaSiteKey]);
  
  useChange(active, active => {
    if(active) recaptcha?.showBadge();
    else recaptcha?.hideBadge();
  });
  
  return { recaptcha, loading };
}
