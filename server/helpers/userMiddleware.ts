import expressCore from "express-serve-static-core";
import * as usersController from "../controllers/users";

export default async function(req: expressCore.RequestEx<any, any, any>, res: expressCore.ResponseEx<any>, next: expressCore.NextFunction) {
  try {
    if(req.session.userId) {
      req.user = await usersController.get(req.session.userId);
    }
    
    next();
  } catch(e) {
    next(e);
  }
}
