import { useDrawerProgress } from "@react-navigation/drawer";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import Bilan from "../../components/Bilan";
import ButtonAdd from "../../components/ButtonAdd";
import { View } from "../../components/Themed";
import Transaction from "../../components/Transaction";
import { AppDispatch, RootState } from "../../store";
import { fetchCountryAndAgencies } from "../../store/country/countrySlice";
import { fetchEntrepriseSlice } from "../../store/entreprise/entrepriseSlice";
import { fetchMessages } from "../../store/message/messageSlice";
import { setPreferences } from "../../store/preference/preferenceSlice";
import { fetchTransactions } from "../../store/transaction/transactionSlice";
import { PURGE_ALL_DATA } from "../_layout";

export default function Home() {
  const progress: any = useDrawerProgress();

  const router = useRouter();
  const navigationState = useRootNavigationState();
  const dispatch: AppDispatch = useDispatch();
  const { user, isAuthenticated, account } = useSelector(
    (state: RootState) => state.auth
  );
  let preference = useSelector((state: RootState) => state.preference);

  let country = useSelector((state: RootState) => state.country);

  useEffect(() => {
    Object.keys(country).forEach((key) => {
      if (account?.telephone?.startsWith(country[key].indicatif)) {
        console.log(
          "samedi54464564",
          country[key].indicatif,
          account.telephone
        );
        dispatch(
          setPreferences({
            ...preference,
            country: { name: country[key].name, id: country[key].id },
            currency: country[key].currency,
          })
        );
      }
    });
  }, []);
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 1.05], "clamp");
    return {
      flex: 1,
      transform: [{ scale }],
    };
  }, []);

  useEffect(() => {
    console.log("4656454564654654");

    dispatch(fetchTransactions());
    dispatch(fetchEntrepriseSlice());
    dispatch(fetchCountryAndAgencies());
    dispatch(fetchMessages());
  }, []);

  useEffect(() => {
    if (!navigationState?.key) return;
    if (!isAuthenticated) {
      router.replace("register/login");
      PURGE_ALL_DATA();
    } else {
      console.log("referesh data");
    }
  }, [isAuthenticated, navigationState?.key]);

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      <View style={styles.container} lightColor="#f7f8fc">
        <Bilan />
        <Transaction />
        <ButtonAdd icon="plus" pathname="/formTransaction" />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginHorizontal: horizontalScale(5),
  },
});
