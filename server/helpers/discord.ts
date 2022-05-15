/* eslint-disable @typescript-eslint/naming-convention */
import axios from "axios";
import configs from "./configs";

export interface CardNotification {
  id: string;
  name: string;
  description: string;
  uploaderName: string;
  uploaderEmail: string;
}

export async function cardNotificationWebhook({ id, name, description, uploaderName, uploaderEmail }: CardNotification) {
  if(configs.discordWebhook) {
    await axios.post(configs.discordWebhook, {
      content: "Lmao!",
      embeds: [
        {
          title: name,
          description,
          url: `${configs.publicUrl}/assets/?approved=false&id=${id}`,
          color: 5814783,
          author: {
            name: `${uploaderName} <${uploaderEmail}>`,
          },
          footer: {
            icon_url: `${configs.publicUrl}/static/openviva_small.png`,
          },
          timestamp: "2022-05-23T22:00:00.000Z",
          image: {
            url: `${configs.publicUrl}/assets/${id}/thumbnail.jpg`,
          },
        },
      ],
      username: "OpenViva Website",
      avatar_url: "https://i.imgur.com/oZoN3II.png",
      attachments: [],
    });
  }
}
