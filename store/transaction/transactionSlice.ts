import { TransactionInterface } from "./../Descriptions";

import { SQuery } from "..";
import { LIMIT_TRANSACTION } from "../../constants/data";

type accountSchema = {
  name: string;
  telephone: string;
  profilePicture: string;
} | null;
type updateTransactionSchema = {
  data: {
    id: string;
    sent?: { value: number; currency: string };
    received?: { value: number; currency: string };
    codePromo?: string;
    senderFile?: any;
    receiverName?: string;
    country?: any;
    telephone?: string;
    carte?: string;
    agenceReceiver?: string;
    agenceSender?: string;
    typeTransaction?: string;
  };
};
export type transactionDataSchema = {
  senderAccount?: accountSchema;
  id?: string;
  manager: accountSchema;
  discussionId: string;
  __updatedAt?: number;
  __createdAt?: number;
  receiverName?: string;
  senderFile?: any;
  managerFile?: any;
  country?: any;
  telephone?: string;
  carte?: string;
  agence?: string;
  codePromo?: string;
  createdAt?: string;
  updatedAt?: string;
  sent?: { value: number; currency: string };
  received?: { value: number; currency: string };
  status: "start" | "run" | "end" | "cancel" | "full" | "";
};
export type TransactionSchema = {
  [TransactionId: string]: transactionDataSchema;
};
type initialState = {
  start: TransactionSchema;
  full: TransactionSchema;
  run: TransactionSchema;
  end: TransactionSchema;
  cancel: TransactionSchema;
  fetchSuccess: boolean;
  fetchLoading: boolean;
};
let initialState: initialState = {
  start: {
    "": { senderAccount: null, manager: null, discussionId: "", status: "" },
  },
  full: {
    "": { senderAccount: null, manager: null, discussionId: "", status: "" },
  },
  run: {
    "": { senderAccount: null, manager: null, discussionId: "", status: "" },
  },
  end: {
    "": { senderAccount: null, manager: null, discussionId: "", status: "" },
  },
  cancel: {
    "": { senderAccount: null, manager: null, discussionId: "", status: "" },
  },
  fetchLoading: false,
  fetchSuccess: false,
};

async function getTransaction({ transactionId }: { transactionId: string }) {
  const transaction = await SQuery.newInstance("transaction", {
    id: transactionId,
  });
  if (!transaction) throw new Error("Transaction not found");

  // transaction.when("refresh", async (transaction) => {
  //   //SetQueryData
  // });

  return {
    ...transaction.$cache,
  };
}

const startTransaction = async () => {
  const result = await SQuery.service("transaction", "start", { id: "" });

  if (result.error) throw new Error(result.error);

  return result.response;
};

const updateTransaction = async ({ data }: updateTransactionSchema) => {
  const transaction = await SQuery.newInstance("transaction", {
    id: data.id,
  });
  if (!transaction) throw new Error("Transaction not found");

  const listener = async (transaction: any) => {
    let asType: TransactionInterface = transaction;
    //SetQueryData
  };
  listener.uid = transaction.$id + "-full";

  transaction.when("refresh", listener);
  await SQuery.service("transaction", "full", data);
};

const fetchTransactions = async (nbrPage = 1) => {
  try {
    // const account = queryClient.getQueryData(queryKey)
    const userInstance = await SQuery.newInstance("user", { id: "UserId" });
    let transactions = await userInstance?.transactions;

    let transactionArrayData = await transactions?.update({
      paging: {
        page: nbrPage,
        limit: LIMIT_TRANSACTION,
      },
    });
    if (!transactionArrayData) throw new Error("Transactions not found");
    return transactionArrayData.items;
  } catch (error: any) {
    throw new Error(error);
  }
};

export {
  fetchTransactions,
  getTransaction,
  startTransaction,
  updateTransaction,
};
