import SQuery from "../../lib/SQueryClient";

export async function create(accountId: string) {
  let accountModel;
  let accountInstance;
  if (!accountId)
    return {
      name: null,
      telephone: null,
      profilePicture: null,
    };
  try {
    accountModel = await SQuery.model("account");
    accountInstance = await accountModel.newInstance({
      id: accountId,
    });
  } catch (error) {
    return {
      name: null,
      telephone: null,
      profilePicture: null,
    };
  }

  if (accountInstance) {
    return {
      name: await accountInstance.name,
      telephone: await accountInstance.telephone,
      profilePicture: (await accountInstance.imgProfile)[0],
    };
  }
}
