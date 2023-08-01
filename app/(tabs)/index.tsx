import { useDrawerProgress } from "@react-navigation/drawer";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import Bilan from "../../components/Bilan";
import ButtonAdd from "../../components/ButtonAdd";
import { View } from "../../components/Themed";
import Transaction from "../../components/Transaction";

import { useQueries, useQuery } from "@tanstack/react-query";
import { Queries_Key } from "../../store";
import { fetchUser } from "../../store/account/createAccount";
import { getAgencies, getCountries } from "../../store/country/countrySlice";
import { fetchDataEntreprise } from "../../store/entreprise/entrepriseSlice";

export default function Home() {
  const progress: any = useDrawerProgress();

  const router = useRouter();
  const navigationState = useRootNavigationState();
  // const dispatch: AppDispatch = useDispatch();
  // const { user, isAuthenticated, account } = useSelector(
  //   (state: RootState) => state.auth
  // );
  // let preference = useSelector((state: RootState) => state.preference);

  // let country = useSelector((state: RootState) => state.country);
  const {
    data: user,
    isError,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: [Queries_Key.user],
    queryFn: fetchUser,
  });

  const { data: entreprise } = useQuery(
    [Queries_Key.entreprise],
    () => fetchDataEntreprise(),
    {
      enabled: !!user?.password,
      cacheTime: Infinity,
    }
  );

  const { data: countries } = useQuery(
    [Queries_Key.countries],
    () => getCountries(),
    {
      enabled: !!entreprise?._id,
      cacheTime: Infinity,
    }
  );

  const agencies = useQueries({
    queries: countries!.map((country) => {
      return {
        queryKey: [Queries_Key.agencies, country._id],
        queryFn: () => getAgencies({ countryId: country._id }),
      };
    }),
  });

  // useEffect(() => {
  //   Object.keys(country).forEach((key) => {
  //     if (account?.telephone?.startsWith(country[key].indicatif)) {
  //       dispatch(
  //         setPreferences({
  //           ...preference,
  //           country: { name: country[key].name, id: country[key].id },
  //           currency: country[key].currency,
  //         })
  //       );
  //     }
  //   });
  // }, []);
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 1.05], "clamp");
    return {
      flex: 1,
      transform: [{ scale }],
    };
  }, []);

  useEffect(() => {
    console.log("4656454564654654");

    // dispatch(fetchTransactions());
    // dispatch(fetchEntrepriseSlice());
    // dispatch(fetchCountryAndAgencies());
    // dispatch(fetchMessages());
  }, []);

  useEffect(() => {
    if (!navigationState?.key) return;
    if (!user) {
      router.replace("register/login");
    } else {
      console.log("referesh data");
    }
  }, [user, navigationState?.key]);

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
