// import { MessageSchema } from './messageSlice';

import { SQuery } from "..";
import { LIMIT_TRANSACTION } from "../../constants/data";
// import SQuery from "../../lib/SQueryClient";
type extension = "jpeg" | "jpg" | "png" | "m4a" | "mp4" | "mp3";
export type MessageDataSchema = {
  text: string;
  right: boolean;
  date: Date;
  files: { _id: string; extension: extension; size: number; url: string }[];
  messageId: string;
};
// export type MessageSchema = {
//   [messageId: string]: MessageDataSchema;
// };

export type MessageSchema =
  | {
      [messageId: string]: MessageDataSchema;
    }
  | {};

interface DiscussionsState {
  [discussionId: string]: MessageSchema;
}

interface initialState {
  discussions: DiscussionsState;
  loading: boolean;
  success: boolean;
}

const initialState: initialState = {
  loading: false,
  success: false,
  discussions: { "": {} },
};
const loadMessage = async (id: string, accountId: any) => {
  const message = await SQuery.newInstance("message", { id });

  if (!message) throw new Error("Message not found");

  const messageData = message.$cache;

  return {
    ...messageData,
    right: accountId === messageData.account,
  };
};

const fetchMessages = async (
  nbPage: number,
  discussionId: string,
  accountId: string
) => {
  const discussionInstance = await SQuery.newInstance("discussion", {
    id: discussionId,
  });
  if (!discussionInstance) throw new Error("Discussion not found");
  const ArrayMessages = await (
    await discussionInstance?.messages
  )?.update({
    paging: {
      page: nbPage,
      limit: LIMIT_TRANSACTION,
    },
  });

  if (!ArrayMessages) throw new Error("Messages not found");

  let ArrayData = ArrayMessages.items.map((message) => {
    return {
      ...message,
      right: accountId === message.account,
      // ...discussionInstance.$cache,
    };
  });
  return ArrayData;
};

async function fetchDiscussion(discussionId: string, accountId: string) {
  const discussionInstance = await SQuery.newInstance("discussion", {
    id: discussionId,
  });

  if (!discussionInstance) throw new Error("Discussion not found");

  return {
    ...discussionInstance.$cache,
  };
}
const addDiscussion = async (idTransaction: string) => {
  const res = await SQuery.service("transaction", "addDiscussion", {
    id: idTransaction,
  });

  res;

  if (res.error) throw new Error(res.error);

  return res.response;
};

const addMessage = async (data: {
  messageText?: string;
  discussionId: string;
  messageFile?: any;
}) => {
  const { discussionId, messageFile, messageText } = data;

  // const account = queryClient.getQueryData(queryKey)

  const discussionInstance = await SQuery.newInstance("discussion", {
    id: discussionId,
  });
  if (!discussionInstance) throw new Error("message cannot added");

  (await discussionInstance.messages)?.when("update", async (data) => {
    if (data.added[0]) {
      // const message = await loadMessage(data.added[0], accountId);
      // QuerieData
    }
  });

  if (discussionInstance.messages) {
    (await discussionInstance.messages).update({
      addNew: [
        {
          // account: "accountId",
          text: messageText,
          files: messageFile,
        },
      ],
    });
  }
};

export { addDiscussion, addMessage, fetchDiscussion, fetchMessages };
