import { Client } from "revolt.js";

import { Message } from "revolt.js/dist/maps/Messages";

async function archiveChannel(client: Client, msg: Message, botMsg?: Message) {
  const autumnURL = msg.client.configuration?.features.autumn.url;

  const archiveData = {
    server_id: "",
    server_name: "",
    channel_id: "",
    channel_name: "",
    archiver: "",
    archived_at: 0,
    messages: [{}],
  };

  // gather info
  const isServer = msg.channel?.server;
  archiveData.server_id = isServer ? msg.channel.server._id : "notAServer";
  archiveData.server_name = isServer ? msg.channel.server.name : "notAServer";
  archiveData.channel_id = msg.channel_id!;
  archiveData.channel_name = msg.channel?.name!;
  archiveData.archiver = msg.author_id;
  archiveData.archived_at = msg.createdAt;

  // fetch/push messages
  let continueFetching = true;
  let fetchbefore = msg._id;
  while (continueFetching) {
    const msgs = await msg.channel?.fetchMessagesWithUsers({
      limit: 100,
      before: fetchbefore,
    });
    if (!msgs || !msgs.messages) return "nothingToArchive";
    const users = msgs.members;
    msgs.messages.forEach((m) => {
      let sender;
      for (const u of users!) {
        if (m.author_id !== u.user?._id) continue;
        sender = u;
      }

      let attachmentsObj: string[] = [];
      m.attachments?.forEach((a) => {
        attachmentsObj.push(`${autumnURL}/attachments/${a._id}/${a.filename}`);
      });
      archiveData.messages.push({
        message_id: m._id,
        sender_id: m.author_id,
        sender_name:
          m.masquerade?.name ?? sender?.nickname ?? m.author?.username, // order: masq > nick > username
        sender_avatar: `${autumnURL}/avatars/${
          m.masquerade?.avatar ?? sender?.avatar
            ? `${sender?.avatar?._id}/${sender?.avatar?.filename}`
            : `${m.author?.avatar?._id}/${m.author?.avatar?.filename}`
        }`, // order: masq > server > global
        content: m.content,
        attachments: attachmentsObj,
      });
      if (msgs.messages.length < 100) {
        continueFetching = false;
      } else {
        fetchbefore = msgs.messages[99]._id;
      }
    });

    return archiveData;
  }
}

export { archiveChannel };
