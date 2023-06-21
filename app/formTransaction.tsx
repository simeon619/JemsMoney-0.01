import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import { useRouter, useSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import PhoneNumber from "google-libphonenumber";
import { phone } from "phone";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, useColorScheme, useWindowDimensions } from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import ButtonAdd from "../components/ButtonAdd";
import Contact from "../components/Contact";

import {
  Easing,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import FinalPayment from "../components/FinalPayment";
import ProofPayment from "../components/ProofPayment";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
import { TransactionServer } from "../fonctionUtilitaire/type";
import { RootState } from "../store";
import { Agency } from "../store/country/countrySlice";
export type valuePassSchema = {
  pays: string;
  valid: boolean;
  agenceReceiver?: string;
  agenceSender?: string;
  currency: string;
};
const makeTransaction = () => {
  let phoneUtil = PhoneNumber.PhoneNumberUtil.getInstance();
  const { height, width } = useWindowDimensions();
  const [user, setUser] = useState<any>(null);

  const [valuePass, setValuePass] = useState<{
    sent: { value: number; currency: string };
    received: { value: number; currency: string };
    agenceSender: Agency;
    senderFile?: string;
  }>();

  const [transactionId, setTransactionId] = useState<string>("");
  const [page, setPage] = useState(0);
  const [dataSavedTransaction, setDataSavedTransaction] =
    useState<TransactionServer>();
  const [status, setStatus] = useState("");
  const colorScheme = useColorScheme();
  const params = useSearchParams();
  const { start, cancel, end, full, run } = useSelector(
    (state: RootState) => state.transation
  );

  let route = useRouter();
  useEffect(() => {
    setTransactionId("id");
    if (params.type === "contact" && Object.keys(start)[1]) {
      let id = Object.keys(start)[1];
      setTransactionId(id);
    } else if (params.type === "transaction" && params.id) {
      let id = params.id as string;
      setTransactionId(id);
    }
  }, [params, start]);

  useEffect(() => {
    console.log("78545");

    [start, cancel, end, full, run].forEach((status) => {
      if (status[transactionId]) {
        setDataSavedTransaction(
          status[transactionId] as any as TransactionServer
        );
      }
      console.log("de la", status[transactionId]);
    });
  });
  console.log(
    "🚀 ~ file: formTransaction.tsx:71 ~ makeTransaction ~ transactionId:",
    transactionId
  );

  let router = useRouter();
  // const contact : ContactShema = params

  const validatePhoneNumber = (phoneNumber: string) => {
    let codeError = {
      isValid: false,
      code: "ZZ",
    };
    if (!phoneNumber && Array.isArray(phoneNumber)) {
      return codeError;
    }
    let parsedNumber;
    let codeCountry;
    try {
      parsedNumber = phoneUtil.parse(phoneNumber);
      codeCountry = phoneUtil.getRegionCodeForNumber(parsedNumber);
    } catch (error) {
      return codeError;
    }

    return {
      isValid: phoneUtil.isValidNumber(parsedNumber),
      code: codeCountry,
    };
  };

  useEffect(() => {
    const getuser = () => {
      let rawNumber = (params.number as string)
        ?.trim()
        .replaceAll(" ", "")
        .replace("+", "");
      let phoneNumber = "+" + rawNumber;

      let result = validatePhoneNumber(phoneNumber);
      let resultPhone = phone(phoneNumber, { country: undefined });

      let isValid = resultPhone.isValid;
      let code = resultPhone.countryCode;
      let number = resultPhone.phoneNumber || params.number;

      if (!result.isValid) {
        isValid = resultPhone.isValid;
        code = resultPhone.countryCode;
        number = params.number;
      }

      setUser({
        isValid,
        code,
        name: params.name,
        id: params.id,
        number,
      });
    };

    getuser();
  }, [params.number]);

  const swiperRef = useRef<PagerView>(null);
  function changeTOProofPayment(
    sent: { value: number; currency: string },
    received: { value: number; currency: string },
    page: number,
    agenceSender: Agency,
    senderFile?: string
  ) {
    swiperRef.current?.setPage(page);
    setPage(page);
    setValuePass({ agenceSender, sent, received, senderFile });
  }
  const changeFrame = (page: number) => {
    swiperRef.current?.setPage(page);
    setPage(page);
  };

  const lastContentOffset = useSharedValue(0);
  const isScrolling = useSharedValue(false);
  const translateY = useSharedValue(0);

  const actionBarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(translateY.value, {
            duration: 750,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
    };
  });
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (
        lastContentOffset.value > event.contentOffset.y &&
        isScrolling.value
      ) {
        translateY.value = 0;
        console.log("scrolling up");
      } else if (
        lastContentOffset.value < event.contentOffset.y &&
        isScrolling.value
      ) {
        translateY.value = 100;
        console.log("scrolling down");
      }
      lastContentOffset.value = event.contentOffset.y;
    },
    onBeginDrag: (e) => {
      isScrolling.value = true;
    },
    onEndDrag: (e) => {
      isScrolling.value = false;
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ButtonAdd
        icon="message"
        pathname="/discussion"
        hideButtonScroll={actionBarStyle}
        dataSavedTransaction={dataSavedTransaction}
      />

      <View
        lightColor="#f6f7fb"
        style={{
          flex: 1,
        }}
      >
        <View
          lightColor="#f6f7fb"
          style={{
            // height: verticalScale(50),
            paddingHorizontal: horizontalScale(15),
            flexDirection: "row",
            justifyContent: "center",
            width,
            padding: verticalScale(7),
          }}
        >
          <Pressable
            onPress={() => {
              if (status && status === "full") {
                route.back();
                setPage(0);
              }
              if (page === 0 || page === 2) {
                router.back();
              } else if (page === 1) {
                swiperRef.current?.setPage(0);
                setPage(0);
              }
            }}
            style={{
              position: "absolute",
              left: horizontalScale(0),
              top: horizontalScale(7),
              zIndex: 99,
            }}
          >
            {({ pressed }) => (
              <MaterialCommunityIcons
                name="arrow-left"
                color={Colors[colorScheme ?? "light"].text}
                size={28}
                style={[
                  {
                    marginLeft: horizontalScale(10),
                    opacity: pressed ? 0.5 : 1,
                    backgroundColor: "#fff",
                    borderRadius: 99,
                    padding: moderateScale(2),
                  },
                  shadow(1),
                ]}
              />
            )}
          </Pressable>
          <Text
            style={{
              fontSize: moderateScale(18),
              fontWeight: "700",
              marginTop: horizontalScale(7),
            }}
          >
            Fill info transaction
          </Text>
          {/* <View /> */}
        </View>
        <PagerView
          style={{ flex: 1 }}
          initialPage={page}
          scrollEnabled={false}
          ref={swiperRef}
        >
          {user !== null ? (
            <Contact
              key={1}
              dataSavedTransaction={dataSavedTransaction}
              user={user}
              transactionId={transactionId}
              changeTOProofPayment={changeTOProofPayment}
              changeFrame={changeFrame}
            />
          ) : (
            <View key={1} />
          )}

          <ProofPayment
            transactionId={transactionId}
            dataSavedTransaction={dataSavedTransaction}
            agenceSender={valuePass?.agenceSender}
            sent={valuePass?.sent}
            received={valuePass?.received}
            // currentCurrency={valuePass?.currentCurrency}
            senderFile={valuePass?.senderFile}
            // sum={valuePass?.sum}
            key={2}
          />
          <FinalPayment
            key={3}
            scrollHandler={scrollHandler}
            dataSavedTransaction={dataSavedTransaction}
          />
        </PagerView>
        <StatusBar style="dark" backgroundColor="#f7f8fc" />
      </View>
    </SafeAreaView>
  );
};

export default makeTransaction;
