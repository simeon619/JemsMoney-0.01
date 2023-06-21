import React from "react";
import { useSelector } from "react-redux";

import Spinner from "react-native-loading-spinner-overlay/lib";
import { moderateScale, shadow } from "../fonctionUtilitaire/metrics";
import { RootState } from "../store";
import { TransactionSchema } from "../store/transaction/transactionSlice";
import { MonoText } from "./StyledText";
import { ScrollView, View } from "./Themed";
import TransactionItem from "./TransactionItem";
const Transaction = () => {
  const { cancel, end, full, run, fetchLoading, fetchSuccess } = useSelector(
    (state: RootState) => state.transation
  );
  const start = useSelector((state: RootState) => state.transation.start);
  const transactionStatuses = [start, full, run, end, cancel];

  console.log(
    "🚀 ~ file: Transaction.tsx:18 ~ Transaction ~ Object.keys(start):",
    Object.keys(start)
  );
  console.log(
    "🚀 ~ file: Transaction.tsx:18 ~ Transaction ~ Object.keys(full):",
    Object.keys(full)
  );
  const renderTransactions = (status: TransactionSchema) => {
    console.log(Object.values(status), "you en me");

    return Object.values(status)
      .filter((item) => !!item?.status)
      .map((item, index) => (
        <TransactionItem key={index} dataTransaction={item} />
      ));
  };

  return (
    <View style={[{ flex: 1, borderRadius: moderateScale(30) }, shadow(5)]}>
      <Spinner
        visible={fetchLoading}
        textContent={"transaction is loading..."}
        cancelable={true}
        overlayColor="#000a"
      />
      <MonoText
        style={{
          padding: moderateScale(15),
          fontSize: moderateScale(25),
          fontWeight: "600",
        }}
      >
        Transaction
      </MonoText>
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        pagingEnabled={true}
        scrollEventThrottle={16}
      >
        {transactionStatuses.map((status) => renderTransactions(status))}
      </ScrollView>
    </View>
  );
};

export default Transaction;
