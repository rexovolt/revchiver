import { Member, Message } from "revolt.js";

async function archiveChannel(msg: Message, ignoredMsgs?: Message[]) {
  const sleep = (ms: number | undefined) =>
    new Promise((r) => setTimeout(r, ms));

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
  function pushMsg(m: Message) {
    // users?: Member[]
    // let sender;
    // for (const u of users!) {
    //   if (m.author_id !== u.user?._id) continue;
    //   sender = u;
    // }

    let attachmentsObj: string[] = [];
    m.attachments?.forEach((a) => {
      attachmentsObj.push(`${autumnURL}/attachments/${a._id}/${a.filename}`);
    });
    archiveData.messages.push({
      message_id: m._id,
      sender_id: m.author_id,
      sender_name:
        m.masquerade?.name ?? m.member?.nickname ?? m.author?.username, // order: masq > nick > username
      sender_avatar: `${autumnURL}/avatars/${
        m.masquerade?.avatar ?? m.member?.avatar
          ? `${m.member?.avatar?._id}/${m.member?.avatar?.filename}`
          : `${m.author?.avatar?._id}/${m.author?.avatar?.filename}`
      }`, // order: masq > server > global
      content: m.content ?? m.system,
      attachments: attachmentsObj,
    });
  }
  let continueFetching = true;
  let fetchbefore = msg._id;
  while (continueFetching) {
    const msgs = await msg.channel?.fetchMessages({
      limit: 100,
      before: fetchbefore,
    });
    if (!msgs) return "nothingToArchive";

    if (fetchbefore === msg._id) {
      const extraMsg = await msg.channel?.fetchMessage(msg._id);
      pushMsg(extraMsg!);
    }
    msgs.forEach((m) => {
      if (!ignoredMsgs || !ignoredMsgs.includes(m)) {
        pushMsg(m);
      }
      if (msgs.length < 100) {
        continueFetching = false;
      } else {
        fetchbefore = msgs[99]._id;
      }
    });

    // wait 5 seconds to prevent ratelimiting
    await sleep(5000);
  }

  return archiveData;
}

export { archiveChannel };
