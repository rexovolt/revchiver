# Revchiver

Archiving library for Revolt.

## Usage

Basic example - **make sure to pass Revolt.JS messages to the function**:

```ts
import { archiveChannel } from "revchiver/dist";

const msg = "<insert revolt.js message object here>";
const ignoredMsgs = ["array", "of", "message", "objects"];

const data = await archiveChannel(msg, ignoredMsgs);
```
