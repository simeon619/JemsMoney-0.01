import React, { useEffect, useState } from "react";
import { Keyboard, Pressable, useColorScheme } from "react-native";

import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import Colors from "../constants/Colors";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
import { TransactionServer } from "../fonctionUtilitaire/type";

import { addDiscussion } from "../store/message/messageSlice";
import { startTransaction } from "../store/transaction/transactionSlice";
const ButtonAdd = ({
  pathname,
  icon,
  hideButtonScroll,
  dataSavedTransaction,
}: {
  pathname: "/formTransaction" | "/discussion";
  icon: "plus" | "message";
  hideButtonScroll?: any;
  dataSavedTransaction?: TransactionServer;
}) => {
  const colorScheme = useColorScheme();
  const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);

  const handleKeyboardDidShow = () => {
    setKeyboardVisible(true);
  };
  const [isClicked, setIsCliked] = useState(false);
  // const { discussions, loading, success } = useSelector(
  //   (state: RootState) => state.message
  // );
  const handleKeyboardDidHide = () => {
    setKeyboardVisible(false);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      handleKeyboardDidShow
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardDidHide
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const opacity = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isKeyboardVisible ? 0 : 1, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      }),
      transform: [
        {
          scale: withTiming(isKeyboardVisible ? 0 : 1, {
            duration: 300,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
    };
  });
  console.log(
    "🚀 ~ file: ButtonAdd.tsx:34 ~ dataSavedTransaction:",
    dataSavedTransaction
  );

  useEffect(() => {
    console.log("1255555", dataSavedTransaction);
    let Disc = Object.keys(discussions).find(
      (discId) => discId === dataSavedTransaction?.discussionId
    );
    console.log(
      "🚀 ~ file: ADDBUTTON.tsx:52 ~ useEffect ~ Disc:",
      Disc,
      isClicked,
      success
    );
    if (Disc && isClicked && success) {
      console.log("12555556", { Disc });
      router.push({
        pathname: "/discussion",
        params: {
          id: Disc,
        },
      });
      setIsCliked(false);
    }
  }, [discussions, isClicked, success]);

  // console.log(hideButtonScroll);

  let router = useRouter();
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          bottom: verticalScale(15),
          right: verticalScale(20),
          // opacity: 1,
        },
        shadow(90),
        opacity,
        hideButtonScroll,
      ]}
    >
      <Pressable
        onPress={() => {
          if (pathname === "/formTransaction") {
            dispatch(startTransaction());
            router.push({
              pathname,
              params: { type: "contact" },
            });
          } else {
            if (dataSavedTransaction?.discussionId) {
              router.push({
                pathname,
                params: { id: dataSavedTransaction.discussionId },
              });
            } else {
              dispatch(addDiscussion(dataSavedTransaction?.id));
              setIsCliked(true);
            }
          }
        }}
      >
        {({ pressed }) => (
          <Entypo
            name={icon}
            size={moderateScale(30)}
            color={Colors[colorScheme ?? "light"].textOverlay}
            style={{
              marginRight: horizontalScale(0),
              opacity: pressed ? 0.5 : 1,
              backgroundColor: Colors[colorScheme ?? "light"].primaryColour,
              padding: moderateScale(15),
              borderRadius: 99,
            }}
          />
        )}
      </Pressable>
    </Animated.View>
  );
};

export default ButtonAdd;
