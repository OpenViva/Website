import React from "react";
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from "react-router-dom/server";
import expressCore from "express-serve-static-core";
import App from "../../client/App";
import { InitialData } from "../../types/api";
import index from '../views/index.handlebars';
import HTTPError from "../helpers/HTTPError";
import configs from "../helpers/configs";
import { PageTitleProvider } from "../../client/hooks/usePageTitle";

const removeTags = /[<>]/g;
const tagsToReplace: Record<string, string> = {
  '<': `\\u003C`, // eslint-disable-line @typescript-eslint/naming-convention
  '>': `\\u003E`, // eslint-disable-line @typescript-eslint/naming-convention
};

export default function reactMiddleware(req: expressCore.RequestEx<any, any, any>, res: expressCore.ResponseEx<any>, next: expressCore.NextFunction) {
  res.react = <Data, >(data: Data) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    
    // noinspection JSUnreachableSwitchBranches
    switch(req.accepts(['html', 'json'])) {
      case "html": {
        (async () => {
          let pageTitle = "OpenViva";
          const initialData: InitialData & Data = {
            ...data,
            _csrf: req.csrfToken ? req.csrfToken() : undefined as any,
            _user: req.user || null,
            _config: {
              discordInvite: configs.discordInvite,
              steamLink: configs.steamLink || null,
              contactEmailBase64: Buffer.from(configs.contactEmail).toString("base64"),
              hcaptchaSiteKey: configs.hcaptcha?.site || null,
            },
          };
          
          const initialDataJSON = JSON.stringify(initialData).replace(removeTags, tag => tagsToReplace[tag] || tag);
          
          const reactContent = ReactDOMServer.renderToString(
            <StaticRouter location={req.originalUrl}>
              <PageTitleProvider value={title => pageTitle = title}>
                <App initialData={initialData} />
              </PageTitleProvider>
            </StaticRouter>,
          );
          
          res.send(index({
            reactContent,
            initialData: initialDataJSON,
            pageTitle,
            production: process.env.NODE_ENV === 'production',
          }));
        })().catch(next);
        break;
      }
      
      case "json":
        res.json(data);
        break;
      
      default:
        throw new HTTPError(406);
    }
    
    return res;
  };
  next();
}
