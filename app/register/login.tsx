import Entypo from "@expo/vector-icons/build/Entypo";
import { Image } from "expo-image";
import { Link, useRootNavigationState, useRouter } from "expo-router";
import phone from "phone";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { magicModal } from "react-native-magic-modal";
import Animated from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { MonoText } from "../../components/StyledText";
import { ScrollView, Text, View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import { normeFormat } from "../../fonctionUtilitaire/data";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../../fonctionUtilitaire/metrics";
import { AppDispatch, RootState } from "../../store";
import { fetchUser } from "../../store/auth/authSlice";

const login = () => {
  const { loading, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { height, width } = useWindowDimensions();
  const [password, setPassword] = useState<string>("2569");
  const [step, setStep] = useState<"1" | "2" | "3">("1");
  const [pays, setPays] = useState<"RU" | "CI" | "CM" | "TG" | "BE" | "">("CI");

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [inputTelUser, setInputTelUser] = useState<string>("0565848273");

  const [validTel, setValidTel] = useState<boolean>(false);
  const colorSheme = useColorScheme();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  useEffect(() => {
    if (!navigationState?.key) return;
    if (isAuthenticated) {
      console.log("gerone");
      router.replace("(tabs)");
    }
  }, [isAuthenticated, navigationState?.key]);

  const dispatch: AppDispatch = useDispatch();
  const ResponseModal = () => {
    const renderItem = ({
      item,
    }: {
      item: "RU" | "CI" | "CM" | "TG" | "BE" | "RDC" | "";
    }) => {
      const { name, digit, indicatif, flag } = normeFormat[item];
      return (
        <TouchableOpacity
          onPress={() => {
            //@ts-ignore
            setPays(item);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: verticalScale(15),
          }}
        >
          <Image
            source={flag}
            style={{
              width: horizontalScale(30),
              height: verticalScale(20),
              marginRight: 5,
              paddingVertical: moderateScale(15),
            }}
          />
          <MonoText style={{ fontSize: moderateScale(18) }}>{name}</MonoText>
          <Text style={{ marginLeft: 10 }}>+{indicatif}</Text>
        </TouchableOpacity>
      );
    };
    return (
      <View
        style={{
          position: "absolute",
          left: 5,
          right: 5,
          bottom: 1,
          padding: moderateScale(10),
          borderRadius: 10,
        }}
      >
        <FlatList
          //@ts-ignore
          data={Object.keys(normeFormat)}
          renderItem={renderItem}
          keyExtractor={(item) => item}
        />
      </View>
    );
  };

  useEffect(() => {
    let validnumber = "+" + normeFormat[pays]?.indicatif + inputTelUser;
    let resultPhone = phone(validnumber, { country: undefined });
    setValidTel(resultPhone.isValid);
    if (resultPhone.isValid) {
      setPhoneNumber(validnumber);
    }
  }, [pays, inputTelUser]);

  const isAcceptable = useCallback(() => {
    if (validTel && password && password.length === 4) {
      console.log(
        "🚀 ~ file: login.tsx:126 ~ logIn ~ phoneNumber:",
        phoneNumber
      );
      return true;
    }
    return false;
  }, [validTel, password]);

  const logIn = () => {
    dispatch(fetchUser({ telephone: phoneNumber, password }));
  };
  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        lightColor="#f6f7fb"
        contentContainerStyle={{
          padding: moderateScale(20),
          marginTop: verticalScale(50),
          // position: "absolute",
        }}
      >
        <Animated.View style={[{}]}>
          <View lightColor="#f6f7fb" style={{ marginTop: horizontalScale(20) }}>
            <Text
              lightColor="#b2c5ca"
              style={{ fontSize: moderateScale(16), fontWeight: "500" }}
            >
              Enter your phone number
            </Text>

            <View
              style={[
                {
                  flexDirection: "row",
                  margin: verticalScale(8),
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#0001",
                },
                shadow(1),
                validTel && { borderWidth: 1, borderColor: "#4a58" },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  magicModal.show(() => <ResponseModal />);
                }}
                style={{
                  // flex: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: horizontalScale(5),
                }}
              >
                <Text
                  lightColor="#b2c5ca"
                  style={{
                    fontSize: moderateScale(18),
                    borderRightColor: "#b2c5ca",
                    borderRightWidth: 1,
                    paddingHorizontal: horizontalScale(10),
                  }}
                >
                  +{normeFormat[pays]?.indicatif}
                </Text>
              </TouchableOpacity>
              <TextInput
                maxLength={parseInt(normeFormat[pays]?.digit) || 0}
                value={inputTelUser}
                placeholder="0565848273"
                onChangeText={setInputTelUser}
                keyboardType="phone-pad"
                style={{
                  // flex: 10,
                  paddingHorizontal: horizontalScale(15),
                  paddingVertical: verticalScale(8),
                  color: Colors[colorSheme ?? "light"].text,
                  fontSize: moderateScale(18),
                }}
              />

              <TouchableOpacity
                style={{
                  flex: 3,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                disabled={!(step === "2")}
              >
                <Image
                  source={[normeFormat[pays]?.flag]}
                  style={{ width: moderateScale(30), aspectRatio: 1 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        <Animated.View style={[]}>
          <View lightColor="#f6f7fb" style={{ marginTop: horizontalScale(20) }}>
            <Text
              lightColor="#b2c5ca"
              style={{ fontSize: moderateScale(16), fontWeight: "500" }}
            >
              Enter your password
            </Text>
            <View
              style={[
                {
                  flexDirection: "row",
                  margin: verticalScale(8),
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#0001",
                },
                shadow(1),
                password?.length > 3 && {
                  borderWidth: 1,
                  borderColor: "#4a58",
                },
              ]}
            >
              <TouchableOpacity
                style={{
                  flex: 2.5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Entypo
                  name="lock"
                  size={25}
                  color={Colors[colorSheme ?? "light"].text}
                />
              </TouchableOpacity>
              <TextInput
                maxLength={4}
                placeholder="****"
                value={password}
                onChangeText={(txt) => setPassword(txt)}
                keyboardType="number-pad"
                style={{
                  flex: 10,
                  paddingHorizontal: horizontalScale(0),
                  paddingVertical: verticalScale(8),
                  color: Colors[colorSheme ?? "light"].text,
                  fontSize: moderateScale(18),
                }}
              />
            </View>
            {/* {password?.length !== 4 ? (
            <Text style={{ color: "#e42", textAlign: "center" }}>
              password invalid
            </Text>
          ) : (
            <Text />
          )} */}
          </View>
          <TouchableOpacity
            style={[
              {
                width: "70%",
                alignSelf: "center",
                backgroundColor: Colors[colorSheme ?? "light"].text,
                marginTop: verticalScale(30),
                paddingVertical: verticalScale(15),
                borderRadius: moderateScale(10),
              },
              !isAcceptable() && { backgroundColor: "#bbb" },
            ]}
            // disabled={!isValid.value}
            onPress={async () => {
              logIn();
            }}
            // disabled={true}
            disabled={!isAcceptable()}
          >
            <Text
              style={{
                textAlign: "center",
                color: Colors[colorSheme ?? "dark"].textOverlay,
                fontSize: moderateScale(17),
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Spinner
          visible={loading}
          textContent={"Loading..."}
          cancelable={false}
        />
        <View
          lightColor="#f6f7fb"
          style={{
            justifyContent: "center",
            // flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
            width: width - horizontalScale(50),
            gap: moderateScale(5),
            paddingTop: verticalScale(40),
          }}
        >
          <MonoText
            style={{
              fontSize: moderateScale(18),
              color: Colors[colorSheme ?? "light"].link,
            }}
          >
            you have already account ?
          </MonoText>
          <Link href={"./signup"}>
            <MonoText
              style={{
                fontSize: moderateScale(20),
                color: Colors[colorSheme ?? "light"].link,
                fontWeight: "600",
                textDecorationLine: "underline",
              }}
            >
              signup
            </MonoText>
          </Link>
        </View>
      </ScrollView>
    </>
  );
};

export default login;
