import { useQueryClient } from "@tanstack/react-query";
import { Queries_Key, SQuery } from "..";

export async function fetchUser() {
  // if (!accountId) throw new Error("Id Account provided");

  const queryClient = useQueryClient();
  const userCache = queryClient.getQueryState([Queries_Key.user]);
  //@ts-ignore
  const account = await SQuery.newInstance("account", {
    id: userCache?.data?._id,
  });

  if (!account) {
    throw new Error("Account not found");
  }
  let user = await account.newParentInstance<"user">();

  if (!user) throw new Error("User not found");
  return {
    ...account.$cache,
    ...user?.$cache,
  };
}
