import { Entypo } from "@expo/vector-icons";
import {
  FirebaseRecaptchaBanner,
  FirebaseRecaptchaVerifierModal,
} from "expo-firebase-recaptcha";
import { Image } from "expo-image";
import { Link, useRootNavigationState, useRouter } from "expo-router";
import { getApp, initializeApp } from "firebase/app";
import {
  PhoneAuthProvider,
  getAuth,
  signInWithCredential,
} from "firebase/auth";
import phone from "phone";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { magicModal } from "react-native-magic-modal";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";

import { MonoText } from "../../components/StyledText";
import { ScrollView, Text, View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import { firebaseConfig } from "../../fonctionUtilitaire/config";
import { normeFormat } from "../../fonctionUtilitaire/data";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../../fonctionUtilitaire/metrics";
import { AppDispatch, RootState } from "../../store";
import { registerUser } from "../../store/auth/authSlice";
// Initialize Firebase JS SDK >=9.x.x
// https://firebase.google.com/docs/web/setup
try {
  initializeApp(firebaseConfig);
} catch (err) {
  // ignore app already initialized error in snack
}

// Firebase references
const app = getApp();
const auth = getAuth(app);

export default function signup() {
  const [pays, setPays] = useState<"RU" | "CI" | "CM" | "TG" | "BE" | "">("CI");
  const recaptchaVerifier = useRef<any>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [inputTelUser, setInputTelUser] = useState<string>("");
  const [verificationId, setVerificationId] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [step, setStep] = useState<"1" | "2" | "3">("1");
  // const [valid, setValid] = useState<boolean>(false);
  const firebaseConfig = app ? app.options : undefined;
  const [message, showMessage] = useState<any>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const attemptInvisibleVerification = false;
  const colorSheme = useColorScheme();
  const dispatch: AppDispatch = useDispatch();
  // const isValid = useSharedValue(false);
  const [validTel, setValidTel] = useState<boolean>(false);
  const { height } = useWindowDimensions();
  useEffect(() => {
    let validnumber = "+" + normeFormat[pays]?.indicatif + inputTelUser;
    let resultPhone = phone(validnumber, { country: undefined });
    setValidTel(resultPhone.isValid);
    if (resultPhone.isValid) {
      setPhoneNumber(validnumber);
    }
  }, [pays, inputTelUser]);
  const { loading, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  const navigationState = useRootNavigationState();
  useEffect(() => {
    if (!navigationState?.key) return;
    if (isAuthenticated) {
      console.log("gerone");
      router.replace("(tabs)");
    }
  }, [isAuthenticated, navigationState?.key]);
  const setStyleShow = (time: any) => {
    return useAnimatedStyle(() => {
      return {
        opacity: withTiming(1, { duration: 100 + time }),
        transform: [
          {
            scale: withTiming(1, {
              duration: 300 + time,
            }),
          },
        ],
        zIndex: 2,
      };
    });
  };

  const setStyleHide = (time: any) => {
    return useAnimatedStyle(() => {
      return {
        opacity: withTiming(0, { duration: 100 + time }),
        transform: [
          {
            scale: withTiming(0, {
              duration: 300 + time,
            }),
          },
        ],
        zIndex: 0,
      };
    });
  };

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
  console.log(verificationId, step, validTel);

  function verifyAndNext(): void {
    // const tel = "+" + normeFormat[pays]?.indicatif + inputTelUser;
    dispatch(
      registerUser({
        telephone: phoneNumber,
        password,
        carte: "3456876509871235",
        name,
      })
    );
  }

  const IsnameAndPassword = useCallback(() => {
    if (name && password && name.length > 3 && password.length === 4) {
      return true;
    }
    return false;
  }, [name, password]);

  return (
    <>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        style={{
          backgroundColor: Colors[colorSheme ?? "light"].backgroundInput,
        }}
        containerStyle={{
          backgroundColor: Colors[colorSheme ?? "light"].backgroundInput,
        }}
        // attemptInvisibleVerification={true}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        lightColor="#f6f7fb"
        contentContainerStyle={{
          padding: 20,
          marginTop: 50,
          // position: "absolute",
        }}
        style={{}}
      >
        <Animated.View
          style={[
            { top: 0 },
            step === "1" ? setStyleShow(50) : setStyleHide(50),
          ]}
        >
          <View lightColor="#f6f7fb" style={{ marginTop: horizontalScale(20) }}>
            <Text
              lightColor="#b2c5ca"
              style={{ fontSize: moderateScale(16), fontWeight: "500" }}
            >
              Enter your name
            </Text>
            <View
              style={[
                {
                  flexDirection: "row",
                  margin: verticalScale(8),
                  borderRadius: 10,
                  borderWidth: 0.4,
                  borderColor: "#0001",
                },
                shadow(1),
                name?.length < 3 && { borderWidth: 0.4, borderColor: "#e42" },
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
                  name="user"
                  size={25}
                  color={Colors[colorSheme ?? "light"].text}
                />
              </TouchableOpacity>
              <TextInput
                // maxLength={10}
                placeholder="full name"
                value={name}
                onChangeText={(txt) => setName(txt)}
                keyboardType="name-phone-pad"
                style={{
                  flex: 10,
                  paddingHorizontal: horizontalScale(0),
                  paddingVertical: verticalScale(8),
                  color: Colors[colorSheme ?? "light"].text,
                  fontSize: moderateScale(18),
                }}
              />
            </View>
            {/* {name?.length < 3 ? (
            <Text style={{ color: "#e42", textAlign: "center" }}>
              name invalid
            </Text>
          ) : (
            <Text />
          )} */}
          </View>
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
                  borderWidth: 0.4,
                  borderColor: "#0001",
                },
                shadow(1),
                name?.length < 3 && { borderWidth: 0.4, borderColor: "#e42" },
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
              !IsnameAndPassword() && { backgroundColor: "#bbb" },
            ]}
            // disabled={!isValid.value}
            onPress={async () => {
              setStep("2");
            }}
            // disabled={true}
            disabled={!(step === "1") || !IsnameAndPassword()}
          >
            <Text
              style={{
                textAlign: "center",
                color: Colors[colorSheme ?? "dark"].textOverlay,
                fontSize: moderateScale(17),
              }}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={[
            { top: -height / 3, left: 0, right: 0 },
            step === "2" ? setStyleShow(50) : setStyleHide(50),
          ]}
        >
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
                  borderWidth: 0.4,
                  borderColor: "#0001",
                },
                shadow(1),
                !validTel && { borderWidth: 0.4, borderColor: "#e42" },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  magicModal.show(() => <ResponseModal />);
                }}
                disabled={!(step === "2")}
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
                editable={step === "2"}
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
                !validTel && { backgroundColor: "#bbb" },
              ]}
              // disabled={!isValid.value}
              onPress={async () => {
                // verifyAndNext();
                try {
                  const phoneProvider = new PhoneAuthProvider(auth);
                  const verificationId = await phoneProvider.verifyPhoneNumber(
                    phoneNumber,
                    recaptchaVerifier.current
                  );
                  console.log({ verificationId: "DROGNA" });

                  console.log({ verificationId });

                  setVerificationId(verificationId);
                  if (!!verificationId) {
                    setStep("3");
                  }
                } catch (err: any) {
                  showMessage(`Error: ${err.message}`);
                  console.log({ verificationId: err });
                }
              }}
              disabled={!(step === "2")}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: Colors[colorSheme ?? "dark"].textOverlay,
                  fontSize: moderateScale(17),
                }}
              >
                Send Verification Code
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <Animated.View
          style={[
            { top: -height / 2 },
            step === "3" ? setStyleShow(50) : setStyleHide(50),
            ,
          ]}
        >
          <Text style={{ textAlign: "center", fontSize: moderateScale(16) }}>
            A code been send at {phoneNumber} please enter this code
          </Text>
          <View
            style={[
              {
                flexDirection: "row",
                margin: verticalScale(8),
                borderRadius: 10,
                borderWidth: 0.4,
                borderColor: "#0001",
              },
              shadow(1),
            ]}
          >
            <TouchableOpacity
              style={{
                // flex: 4,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: horizontalScale(5),
              }}
              disabled={!(step === "3")}
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
                OTP
              </Text>
            </TouchableOpacity>
            <TextInput
              maxLength={6}
              value={verificationCode}
              editable={step === "3"}
              placeholder="123456"
              onChangeText={setVerificationCode}
              keyboardType="phone-pad"
              style={{
                flex: 10,
                paddingHorizontal: horizontalScale(15),
                paddingVertical: verticalScale(8),
                color: Colors[colorSheme ?? "light"].text,
                fontSize: moderateScale(18),
              }}
            />
          </View>
          <TouchableOpacity
            style={[
              {
                width: "70%",
                alignSelf: "center",
                backgroundColor: Colors[colorSheme ?? "light"].text,
                marginTop: verticalScale(10),
                paddingVertical: verticalScale(15),
                borderRadius: moderateScale(10),
              },
            ]}
            disabled={!(step === "3")}
            onPress={async () => {
              try {
                const credential = PhoneAuthProvider.credential(
                  verificationId,
                  verificationCode
                );
                console.log(
                  "🚀 ~ file: signup.tsx:592 ~ onPress={ ~ verificationId:",
                  verificationId,
                  verificationCode
                );

                let User = await signInWithCredential(auth, credential);
                console.log({ User });

                setVerificationId("");
                setVerificationCode("");
                showMessage(`Phone authentication successful 👍`);
                verifyAndNext();
              } catch (err: any) {
                showMessage(`Error: ${err.message}`);
              }
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: Colors[colorSheme ?? "dark"].textOverlay,
                fontSize: moderateScale(17),
              }}
            >
              confirm code
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
      <Spinner
        visible={loading}
        textContent={"Loading..."}
        cancelable={false}
      />
      <View
        lightColor="#f6f7fb"
        style={{
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "baseline",
          gap: moderateScale(5),
          padding: moderateScale(20),
        }}
      >
        <MonoText
          style={{
            fontSize: moderateScale(18),
            color: Colors[colorSheme ?? "light"].link,
          }}
        >
          Don't have a account ?
        </MonoText>
        <Link href={"./login"}>
          <MonoText
            style={{
              fontSize: moderateScale(20),
              color: Colors[colorSheme ?? "light"].link,
              fontWeight: "600",
              textDecorationLine: "underline",
            }}
          >
            login
          </MonoText>
        </Link>
      </View>
      {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
    </>
  );
}
