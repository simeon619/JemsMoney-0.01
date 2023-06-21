import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "expo-image";
import { useNavigation, useSearchParams } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { TouchableOpacity, useColorScheme } from "react-native";
import { MonoText } from "../components/StyledText";
import { ScrollView, View } from "../components/Themed";
import Colors from "../constants/Colors";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
const DetailTransaction = () => {
  const params = useSearchParams();
  console.log(params);
  const colorSheme = useColorScheme();
  const ItemStatus = ({ title, label }: { title: string; label: any }) => {
    return (
      <View style={{ marginVertical: verticalScale(20) }}>
        <MonoText style={{ fontSize: moderateScale(15) }}>{title}</MonoText>
        <MonoText style={{ fontSize: moderateScale(19) }}>{label}</MonoText>
      </View>
    );
  };

  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
      >
        <FontAwesome
          name="arrow-left"
          size={28}
          style={{
            backgroundColor: Colors[colorSheme ?? "light"].background,
            padding: moderateScale(25),
          }}
        />
      </TouchableOpacity>

      <ScrollView style={{ paddingLeft: horizontalScale(25), flex: 1 }}>
        <Image
          style={{
            width: 50,
            aspectRatio: 1,
            marginVertical: verticalScale(10),
          }}
          source={require("../assets/images/user.png")}
        />
        <View>
          <MonoText
            lightColor="#000"
            style={{ fontWeight: "600", fontSize: moderateScale(30) }}
          >
            {params.montant}CFA
          </MonoText>
          <MonoText
            lightColor="#000"
            style={{ fontWeight: "600", fontSize: moderateScale(20) }}
          >
            {params.name}
          </MonoText>
        </View>
        {/* <ItemStatus title="Amount received" label={params.received + " CFA"} /> */}
        <ItemStatus title="Fee" label={"250" + " CFA"} />
        <ItemStatus title="Status" label={params.status} />
        <ItemStatus title="Date et heure" label={params.date} />
        <ItemStatus title="ID Transaction" label={"TXDEH125S"} />
        <MonoText
          style={{ textAlign: "center", textDecorationLine: "underline" }}
        >
          Jems Money
        </MonoText>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailTransaction;
