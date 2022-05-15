import nodemailer from "nodemailer";
import configs from "./configs";

export const emailTransport = configs.email ? nodemailer.createTransport(configs.email) : null;

interface SendMailOptions {
  recipient: string;
  title: string;
  name: string;
  content: string;
  baseUrl: string;
}

export function isConfigured() {
  return !!emailTransport;
}

export async function send(options: SendMailOptions) {
  if(!emailTransport) {
    console.error(`Nodemailer not initialized. Failed to send mail to ${options.recipient}.`);
    return;
  }
  
  return await emailTransport.sendMail({
    from: configs.email?.auth?.user,
    to: options.recipient,
    subject: options.title,
    html: layout(options),
  });
}

export function layout({ title, name, content, baseUrl }: SendMailOptions) {
  return `
<html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
      @import url("https://fonts.googleapis.com/css?family=Open+Sans:400,600,700");
    </style>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Open Sans', sans-serif;" bgcolor="#f7f7f7">
    <table width="100%" align="center" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" height="100" bgcolor="#f2f2f2" style="background-color: #f2f2f2;">
          <a href="${baseUrl}" style="text-decoration: none; color: #4d5bc7;" target="_blank">
            <h1>
              <img src="${baseUrl}/static/openviva_small.png" width="64" height="64" border="0" align="middle" style="vertical-align: middle" />
              &nbsp;
              OpenViva
            </h1>
          </a>
        </td>
      </tr>
      <tr>
        <td align="center" height="32" bgcolor="#ffffff" style="background-color: #ffffff;">
          &nbsp;
        </td>
      </tr>
      <tr>
        <td align="center">
          <table width="400px" cellspacing="0" cellpadding="0">
            <tr>
              <td align="left">
                &nbsp;
                <h2 style="color: #4d5bc7">Hi, ${name}</h2>
                
                ${content}
                
                <p>
                  Best regards,<br>
                  Open Viva Community
                </p>
                &nbsp;
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" height="32" bgcolor="#ffffff" style="background-color: #ffffff;">
          &nbsp;
        </td>
      </tr>
      <tr>
        <td align="center" height="4" bgcolor="#4d5bc7"></td>
      </tr>
  </table>
  </body>
</html>
`;
}

