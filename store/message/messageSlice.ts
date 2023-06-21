// import { MessageSchema } from './messageSlice';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { isObjectNotEmpty } from "../../fonctionUtilitaire/utils";
import SQuery from "../../lib/SQueryClient";
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
const createMessage = async (id: string, accountId: any) => {
  try {
    const messageModel = await SQuery.model("message");
    const messageInstance = await messageModel.newInstance({
      id,
    });

    if (messageInstance) {
      const messageText = await messageInstance.text;
      const messageFile = await messageInstance.files;
      const messageId = await messageInstance._id;
      const date = await messageInstance.__createdAt;
      const right = accountId === (await messageInstance.account).$id;

      return {
        text: messageText,
        right,
        date,
        messageId,
        files: messageFile,
      };
    } else {
      throw new Error("Message instance not found");
    }
  } catch (error) {
    console.error("An error occurred while creating message:", error);
    throw error;
  }
};

async function createDiscussion(
  discussionId: string,
  accountId: string,
  thunkAPI: any
) {
  try {
    const discussionInstance = await SQuery.newInstance("discussion", {
      id: discussionId,
    });
    if (discussionInstance) {
      console.log(
        await (
          await discussionInstance.messages
        ).when,
        "dd98s7d89s78d7"
      );

      await (
        await discussionInstance.messages
      ).when("update", async (data: any) => {
        console.log("🚀 85632555454", data);
        if (data.added[0]) {
          const createdMessage = await createMessage(data.added[0], accountId);
          thunkAPI.dispatch(
            messageSlice.actions.fetchMessagesFulfilled([
              {
                messages: createdMessage,
                discussionId,
              },
            ])
          );
        }
      });
      const messageItems = (await (await discussionInstance.messages).page())
        .items;
      const arrayMessagePromise = messageItems.map((message: any) => {
        return new Promise(async (resolve, reject) => {
          try {
            const createdMessage = await createMessage(message._id, accountId);
            resolve(createdMessage);
          } catch (error) {
            reject(error);
          }
        });
      });
      const messageResults = await Promise.allSettled(arrayMessagePromise);
      const messages = messageResults
        .filter((result: any) => result.status === "fulfilled" && result.value)
        .map((result: any) => result.value);
      return {
        messages: messages.length === 0 ? {} : messages,
        discussionId,
      };
    } else {
      return {
        error: "Discussion instance not found",
        discussionId,
      };
    }
  } catch (error) {
    console.error("An error occurred while creating discussion:", error);
    throw error;
  }
}
export const fetchMessages = createAsyncThunk(
  "message/fetch",
  async (_, thunkAPI) => {
    try {
      console.log("***56145646845641654*****445646464**66494654");
      // const { discussionId } = data;
      const accountId = (thunkAPI.getState() as RootState)?.auth.account?._id;
      const userId = (thunkAPI.getState() as RootState)?.auth.user?._id;

      return new Promise(async (resolve: any, reject) => {
        let userInstance;
        try {
          userInstance = await SQuery.newInstance("user", {
            id: userId,
          });
        } catch (error) {
          reject({ err: "errr1", error });
        }

        let discussionArray;
        try {
          discussionArray = (
            await (await userInstance?.transactions).page()
          ).items.map((transaction: any) => {
            return new Promise(async (res, rej) => {
              let discussionId = transaction.discussion;
              if (discussionId) {
                try {
                  res(
                    await createDiscussion(discussionId, accountId, thunkAPI)
                  );
                } catch (error) {
                  rej({ err: "errr2", error });
                }
              } else {
                rej({ info: "discussion not again created" });
              }
            });
          });
        } catch (error) {
          reject({ err: "errr3", error });
        }

        let discussions = null;
        try {
          discussions = (await Promise.allSettled(discussionArray))
            .filter((f: any) => !!f?.value)
            .map((p: any) => p.value);
        } catch (error) {
          reject({ err: "errr4", error });
        }

        if (discussions?.length !== 0) resolve(discussions);
      });
    } catch (error) {
      console.error("An error occurred while fetching messages:", error);
      throw error;
    }
  }
);

export const addDiscussion = createAsyncThunk(
  "transaction/addDiscussion",
  async (idTransaction: string | undefined, thunkAPI) => {
    console.log(
      "🚀 ~ file: messageSlice.ts:141 ~ idTransaction:",
      idTransaction
    );
    let transaction: any;
    let discussion;
    const accountId = (thunkAPI.getState() as RootState)?.auth.account._id;
    if (idTransaction) {
      transaction = await SQuery.service("transaction", "addDiscussion", {
        id: idTransaction,
      });
      console.log(
        "🚀 ~ file: messageSlice.ts:152 ~ discussionId:",
        transaction
      );
      if (transaction?.discussion) {
        discussion = await createDiscussion(
          transaction?.discussion,
          accountId,
          thunkAPI
        );
        console.log("🚀 ~ file: messageSlice.ts:138 ~ discussion:", discussion);
        if (discussion && !discussion?.error) {
          console.log(
            "🚀 ~ file: messageSlice.ts:141 ~ discussion:",
            discussion
          );

          thunkAPI.dispatch(
            messageSlice.actions.fetchMessagesFulfilled([discussion])
          );
        } else {
          console.warn(discussion?.error);
        }
      }
    }
  }
);
export const addMessage = createAsyncThunk(
  "message/add",
  async (
    data: {
      messageText?: string;
      discussionId: string;
      messageFile?: any;
    },
    thunkAPI
  ) => {
    const { discussionId, messageFile, messageText } = data;
    console.log("🚀 ~ file: messageSlice.ts:138 ~ data:", data);
    const accountId = (thunkAPI.getState() as RootState).auth.account._id;
    let discussionInstance = null;
    try {
      discussionInstance = await SQuery.newInstance("discussion", {
        id: discussionId,
      });
    } catch (error) {
      console.log(error);
    }
    if (discussionInstance && discussionInstance.messages) {
      discussionInstance.messages = {
        addNew: [
          {
            account: accountId,
            text: messageText,
            files: messageFile,
          },
        ],
      };
    }
  }
);

export const messageSlice = createSlice({
  name: "message",
  initialState: initialState,
  reducers: {
    fetchMessagesFulfilled: (state, action) => {
      console.log(action.payload as any, "7855554");
      if (!(action.payload as any)) {
        return;
      }
      const datasMessagePayload = action.payload as any;
      datasMessagePayload.forEach((MessagePayload: any) => {
        const { discussionId, messages } = MessagePayload as {
          discussionId: string;
          messages: any;
        };
        console.log(
          "🚀 ~ file: messageSlice.ts:282 ~ datasMessagePayload.forEach ~ { discussionId, messages }:",
          { discussionId, messages }
        );

        if (!discussionId) {
          return;
        }
        let discussion = state.discussions[discussionId];
        if (!discussion) {
          discussion = {};
        }

        const updatedMessages = { ...discussion };
        if (messages.messageId) {
          updatedMessages[messages.messageId] = messages;
        }
        state["discussions"] = {
          ...discussion,
          [discussionId]: updatedMessages,
        };
      });
      state.loading = false;
      state.success = true;
      console.log("fulfilled:fetchMessages", state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      if (!(action.payload as any)) {
        return;
      }
      console.log(action.payload as any, "88848748");
      const datasMessagePayload = action.payload as any;
      datasMessagePayload.forEach((MessagePayload: any) => {
        const { discussionId, messages } = MessagePayload;
        if (!discussionId) {
          return;
        }
        let discussion = state.discussions[discussionId];
        if (!discussion) {
          discussion = {};
        }
        const updatedMessages = { ...discussion };
        if (Array.isArray(messages)) {
          messages.forEach((message: any) => {
            updatedMessages[message.messageId] = message;
          });
        } else if (isObjectNotEmpty(messages)) {
          updatedMessages[messages.messageId] = messages;
        }
        state["discussions"] = {
          ...discussion,
          [discussionId]: updatedMessages,
        };
      });
      state.loading = false;
      state.success = true;
      console.log("fulfilled:fetchMessages", state);
    });
    builder.addCase(fetchMessages.pending, (state, action) => {
      if (!!!(action.payload as any)) {
        return;
      }
      const { discussionId } = action.payload as any;
      const discussion = state["discussions"][discussionId];

      if (!discussion) {
        state["discussions"][discussionId] = {};
      }
      state.loading = true;
      state.success = false;
      console.log("pending5555:fetchMessages");
    });
    builder.addCase(fetchMessages.rejected, (state, action) => {
      if (!!!(action.payload as any)) {
        return;
      }
      const { discussionId } = action.payload as any;

      const discussion = state["discussions"][discussionId];

      if (!discussion) {
        state["discussions"][discussionId] = {};
      }
      state.loading = false;
      state.success = false;
      console.log("rejected:fetchMessages");
    });
  },
});
export const {} = messageSlice.actions;

export default messageSlice.reducer;
