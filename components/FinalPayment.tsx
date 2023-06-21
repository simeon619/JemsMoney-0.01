import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Animated from "react-native-reanimated";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
import { TransactionServer } from "../fonctionUtilitaire/type";
import { MonoText } from "./StyledText";
import { View } from "./Themed";
const FinalPayment = ({
  scrollHandler,
  dataSavedTransaction,
}: {
  scrollHandler: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  dataSavedTransaction: TransactionServer | undefined;
}) => {
  const { width, height } = useWindowDimensions();

  return (
    <>
      {!!dataSavedTransaction?.receiverName && (
        <View style={styles.container}>
          <View
            style={{
              flex: 0.2,
            }}
          />
          <View
            style={[
              {
                // height: height / 2,
                flex: 5,
                borderWidth: 1,
                borderColor: "#1254",
                borderRadius: moderateScale(10),
                overflow: "hidden",
              },
              shadow(20),
            ]}
          >
            <Animated.ScrollView
              showsVerticalScrollIndicator={true}
              // onScroll={scrollHandler}
              scrollEventThrottle={16}
              alwaysBounceVertical={true}
              // style={{ marginBottom: verticalScale(100) }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                <MonoText style={styles.title}>Transaction Tracking</MonoText>
                <FontAwesome
                  name="clock-o"
                  size={22}
                  color="#F9A825"
                  style={styles.icon}
                />
              </View>
              <MonoText style={styles.description}>
                Your transaction is currently being verified. Please wait while
                we verify the details of your transaction.
              </MonoText>
              <MonoText style={styles.description}>
                Once the verification is complete, we will inform you of the
                status of your transaction.
              </MonoText>
              <View style={styles.recipientInfo}>
                <MonoText style={styles.recipientText}>
                  The recipient will receive{" "}
                  {dataSavedTransaction?.received.value}{" "}
                  {dataSavedTransaction?.received.currency} on the following
                  number:{" "}
                  <MonoText style={styles.recipientNumber}>
                    {dataSavedTransaction?.telephone}
                  </MonoText>
                </MonoText>
              </View>
              <MonoText style={styles.description}>
                Please click on the icon below to chat with an agent if you have
                any additional questions.
              </MonoText>
            </Animated.ScrollView>
          </View>
          <View style={{ flex: 1, backgroundColor: "transparent" }} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(10),
  },
  iconContainer: {
    backgroundColor: "transparent",
    flex: 2,
    // marginLeft: 50,
    // alignItems: "center",
    // position: "absolute",
  },
  icon: {
    alignSelf: "center",
    // left: "10%",
    // width: "100%",
    // height: "100%",
  },
  recipientInfo: {
    marginVertical: verticalScale(20),
    backgroundColor: "#FFF",
    borderRadius: 5,
  },
  recipientText: {
    fontSize: moderateScale(20),
    color: "#444",
    textAlign: "center",
  },
  recipientNumber: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    color: "#F9A825",
  },
  title: {
    fontSize: moderateScale(25),
    fontWeight: "bold",
    color: "#F9A825",
    textAlign: "center",
    marginBottom: verticalScale(10),
  },
  description: {
    fontSize: moderateScale(20),
    marginBottom: 10,
    color: "#444",
    textAlign: "center",
  },
});

export default FinalPayment;
