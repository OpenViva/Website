import expressCore from "express-serve-static-core";
import hcaptcha from "hcaptcha";
import configs from "../helpers/configs";
import HTTPError from "../helpers/HTTPError";

export default async function captchaMiddleware(req: expressCore.RequestEx<any, any, any>, res: expressCore.ResponseEx<any>, next: expressCore.NextFunction) {
  try {
    if(configs.hcaptcha) {
      const result = await hcaptcha.verify(configs.hcaptcha.secret, req.body["h-captcha-response"]);
      
      if(!result.success) return next(new HTTPError(400, "You need to solve captcha to perform this operation.", `Captcha error: ${result["error-codes"]?.join(", ")}`));
    }
    
    next();
  } catch(e) {
    next(e);
  }
}
