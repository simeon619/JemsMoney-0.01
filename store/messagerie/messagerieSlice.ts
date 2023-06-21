import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import SQuery from "../../lib/SQueryClient";
import { create } from "../account/createAccount";
type accountSchema = {
  name: string;
  telephone: string;
  profilePicture: string;
} | null;
type SchemaDiscussion = {
  [discussionId: string]: {
    user: accountSchema;
    manager: accountSchema;
    discussionId: string;
  };
};
type SchemaStateDiscussion = {
  close: SchemaDiscussion;
  isSuccess: boolean;
  open: SchemaDiscussion;
  loading: boolean;
};
let initialState: SchemaStateDiscussion = {
  close: { "": { manager: null, user: null, discussionId: "" } },
  isSuccess: false,
  open: { "": { manager: null, user: null, discussionId: "" } },
  loading: false,
};
// const router = useRouter();

async function createDisc(id: string) {
  const discussionModel = await SQuery.model("discussion");
  const discussionInstance = await discussionModel.newInstance({
    id,
  });
  console.log({ discussionInstance });
  if (discussionInstance) {
    let user = await discussionInstance.$cache.user;
    let manager = await discussionInstance.$cache?.manager;

    return {
      user: await create(user),
      manager: await create(manager),
      discussionId: await discussionInstance._id,
    };
  }
}

const fetchDiscussions = createAsyncThunk(
  "discussion/fetch",
  async (data: { idMessennger: string }, thunkAPI) => {
    try {
      const { idMessennger } = data;
      return new Promise(async (resolve: any, reject) => {
        let InstanceMessenger = null;
        try {
          const messengerModel = await SQuery.model("messenger");
          InstanceMessenger = await messengerModel.newInstance({
            id: idMessennger,
          });
        } catch (error) {
          console.log(error);
          return thunkAPI.rejectWithValue({ error });
        }
        if (InstanceMessenger) {
          try {
            (await InstanceMessenger.opened).when(
              "update",
              async (data: any) => {
                if (data.added[0]) {
                  thunkAPI.dispatch(
                    discussionSlice.actions.fetchDiscussionsFulfilled({
                      open: [await createDisc(data.added[0])],
                    })
                  );
                }
              }
            );
            (await InstanceMessenger.closed).when(
              "update",
              async (data: any) => {
                if (data.added[0]) {
                  thunkAPI.dispatch(
                    discussionSlice.actions.fetchDiscussionsFulfilled({
                      close: [await createDisc(data.added[0])],
                    })
                  );
                }
              }
            );
          } catch (error) {
            console.error("DISCUSSION NOT CREATED");
            return reject(thunkAPI.rejectWithValue({ error: error }));
          }
          let pDiscClose = (
            await (await InstanceMessenger.closed).page()
          ).items.map((discussion: any) => {
            return new Promise(async (res, rej) => {
              res(await createDisc(discussion._id));
            });
          });
          let discsClosed = (await Promise.allSettled(pDiscClose))
            .filter((f: any) => !!f?.value)
            .map((p: any) => p.value);

          let pDiscOpen = (
            await (await InstanceMessenger.opened).page()
          ).items.map((discussion: any) => {
            return new Promise(async (res, rej) => {
              res(await createDisc(discussion._id));
            });
          });
          let discsOpened = (await Promise.allSettled(pDiscOpen))
            .filter((f: any) => !!f?.value)
            .map((p: any) => p.value);

          return resolve({
            open: discsOpened,
            close: discsClosed,
          });
        } else {
          return reject(thunkAPI.rejectWithValue({ error: "error.message" }));
        }
      });
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

const discussionSlice = createSlice({
  name: "discussion",
  initialState: { ...initialState },
  reducers: {
    fetchDiscussionsFulfilled: (state, action) => {
      const { close, open } = action.payload as any as {
        close: any[];
        open: any[];
      };

      if (open) {
        open.forEach((o) => {
          state.open[o.discussionId] = o;
        });
      }
      if (close) {
        close.forEach((c) => {
          state.close[c.discussionId] = c;
        });
      }

      state.isSuccess = true;
      state.loading = false;

      console.log("fulfilled", action);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDiscussions.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDiscussions.fulfilled, (state, action) => {
      const { close, open } = action.payload as any as {
        close: any[];
        open: any[];
      };

      if (open) {
        open.forEach((o) => {
          state.open[o.discussionId] = o;
        });
      }
      if (close) {
        close.forEach((c) => {
          state.close[c.discussionId] = c;
        });
      }
      state.isSuccess = true;
      state.loading = false;
    });
    builder.addCase(fetchDiscussions.rejected, (state) => {
      state.isSuccess = false;
      state.loading = false;
    });
    builder.addCase(PURGE, () => initialState);
  },
});

// export const {} = discussionSlice.actions;

// export default discussionSlice.reducer;
