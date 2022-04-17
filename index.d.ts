import { Client } from "revolt.js";

import { Message } from "revolt.js/dist/maps/Messages";

export default function archive(
  client: Client,
  msg: Message,
  botMsg?: Message
): Promise<string>;
