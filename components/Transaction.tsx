import React from "react";

import { moderateScale, shadow } from "../fonctionUtilitaire/metrics";

import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { queryClient } from "../app/_layout";
import { LIMIT_TRANSACTION } from "../constants/data";
import { Queries_Key } from "../store";
import { TransactionInterface } from "../store/Descriptions";
import { fetchTransactions } from "../store/transaction/transactionSlice";
import { MonoText } from "./StyledText";
import { Text, View } from "./Themed";
import TransactionItem from "./TransactionItem";
const Transaction = () => {
  const {
    data,
    status,
    fetchNextPage,
    isError,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery([Queries_Key.transaction], () => fetchTransactions(), {
    getNextPageParam: (lastPage, allPages) => {
      const nextPage =
        lastPage.length === LIMIT_TRANSACTION ? allPages.length + 1 : undefined;
      return nextPage;
    },
    keepPreviousData: true,
  });

  const renderTransactionItem = (status: TransactionInterface) => {
    return <TransactionItem dataTransaction={status} />;
  };
  const handleRefresh = () => {
    queryClient.resetQueries(["transaction"]);
  };
  const renderFooter = () => {
    if (data?.pages.flat().length === 0) {
      return (
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <Text>Effectuer votre premiere transaction</Text>
        </View>
      );
    }

    if (!isFetchingNextPage) {
      return (
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <Text>Nous sommes à la fin de la liste.</Text>
        </View>
      );
    }
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ marginVertical: 20 }}
      />
    );
  };
  return (
    <SafeAreaView
      style={[{ flex: 1, borderRadius: moderateScale(30) }, shadow(5)]}
    >
      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginVertical: 20 }}
        />
      )}
      <MonoText
        style={{
          padding: moderateScale(15),
          fontSize: moderateScale(25),
          fontWeight: "600",
        }}
      >
        Transaction
      </MonoText>
      <View style={[{ flex: 1, borderRadius: moderateScale(30) }, shadow(5)]}>
        <FlatList
          data={data?.pages.flatMap((page) => page)}
          renderItem={({ item }) => renderTransactionItem(item)}
          keyExtractor={(item) => item._id}
          onEndReached={() => fetchNextPage()}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isFetchingNextPage}
              onRefresh={handleRefresh}
              colors={["#9Bd35A", "#689F38"]}
              progressBackgroundColor="#F0F0F0"
            />
          }
          ListFooterComponent={renderFooter}
        />
      </View>
    </SafeAreaView>
  );
};

export default Transaction;
