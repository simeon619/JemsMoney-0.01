import AsyncStorage from "@react-native-async-storage/async-storage";
import PhoneNumber from "google-libphonenumber";
import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

const shadow = (elevation: number) => {
  if (Platform.OS === "ios") {
    return {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: elevation,
      },
      shadowOpacity: 0.1,
      shadowRadius: elevation / 2,
    };
  } else {
    return {
      elevation: elevation,
    };
  }
};

let phoneUtil = PhoneNumber.PhoneNumberUtil.getInstance();
export const validatePhoneNumber = (phoneNumber: string) => {
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

const removeValue = async (keyStorage: string) => {
  try {
    await AsyncStorage.removeItem(keyStorage);
  } catch (e) {}
  console.log("Done. removeItem");
};
const setStringValue = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log("Error storing cookie:", e);
  }
  console.log("Done.");
};
const getMyStringValue = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    // read error
  }

  console.log("Done.");
};

export {
  horizontalScale,
  verticalScale,
  moderateScale,
  shadow,
  removeValue,
  setStringValue,
  getMyStringValue,
};
