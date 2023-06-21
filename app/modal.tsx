import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
import { AppDispatch, RootState } from "../store";
import { fetchContacts } from "../store/contact/fetchhContact";
import { startTransaction } from "../store/transaction/transactionSlice";

export type ContactShema = {
  id: string;
  name: string;
  phoneNumbers: { number: string }[];
};
export default function ModalScreen() {
  // const [listContact, setListContact] = useState<ContactShema[]>([]);
  const { height, width } = useWindowDimensions();
  const [value, onChangeText] = useState("");
  const colorScheme = useColorScheme();
  let router = useRouter();
  let dispatch: AppDispatch = useDispatch();
  let listContact = useSelector((state: RootState) => state.contact);

  useEffect(() => {
    fetchContacts(listContact, dispatch);
  }, []);
  const contactFind = useMemo(() => {
    return listContact?.filter((contact) => {
      const searchTextLowerCase = value?.toLowerCase();

      return (
        contact.name.toLowerCase().includes(searchTextLowerCase) ||
        contact.phoneNumbers.some((phoneNumber) => {
          return phoneNumber.number.includes(searchTextLowerCase);
        })
        //
      );
    });
  }, [value, listContact]);

  // console.log(contactFind.phoneNumbers[0].number, "dagobert");

  const ContactItem = React.memo<ContactShema>((contact) => {
    return (
      <TouchableOpacity
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: verticalScale(5),
            gap: horizontalScale(7),
            paddingLeft: horizontalScale(15),
          },
          shadow(0),
        ]}
        onPress={() => {
          dispatch(startTransaction());
          router.push({
            pathname: "/formTransaction",
            params: {
              type: "contact",
              name: contact.name,
              id: contact.id,
              number: contact.phoneNumbers[0].number,
            },
          });
        }}
      >
        <Image
          style={{ width: moderateScale(40), aspectRatio: 1 }}
          source={require("../assets/images/user.png")}
        />
        <View>
          <Text
            style={{
              fontWeight: "900",
              fontSize: moderateScale(18),
              width: width - horizontalScale(90),
            }}
          >
            {contact.name}
          </Text>
          <Text
            style={{
              fontWeight: "200",
              fontSize: moderateScale(18),
              width: width - horizontalScale(90),
            }}
          >
            {contact.phoneNumbers[0].number}
          </Text>
        </View>
      </TouchableOpacity>
    );
  });
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width,
          backgroundColor: Colors[colorScheme ?? "light"].primaryColour,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          {({ pressed }) => (
            <MaterialCommunityIcons
              name="arrow-left"
              color={"#ddda"}
              size={28}
              style={{
                marginLeft: horizontalScale(10),
                opacity: pressed ? 0.5 : 1,
              }}
            />
          )}
        </Pressable>

        <TextInput
          editable
          autoFocus={true}
          keyboardType={"numbers-and-punctuation"}
          placeholder="Search contact"
          placeholderTextColor={"#ddda"}
          onChangeText={(text) => onChangeText(text)}
          value={value}
          style={{
            paddingLeft: horizontalScale(5),
            paddingVertical: verticalScale(10),
            fontSize: 20,
            color: "#ddda",
            width: width - horizontalScale(80),
          }}
        />
        <Pressable onPress={() => {}}>
          {({ pressed }) => (
            <MaterialCommunityIcons
              name="numeric"
              size={28}
              color={"#ddda"}
              style={{
                opacity: pressed ? 0.5 : 1,
              }}
            />
          )}
        </Pressable>
      </View>
      <FlatList
        data={contactFind}
        // data={[
        //   { id: "1", name: "olopmip", phoneNumbers: [{ number: "445888888" }] },
        // ]}
        style={{ backgroundColor: "#fff" }}
        ListFooterComponent={
          <View style={{ height: verticalScale(80), width }} />
        }
        // keyboardShouldPersistTaps={true}
        // scrollToOverflowEnabled={true}
        ListHeaderComponent={
          <View style={{ height: verticalScale(5), width }}>
            <Text>Contact </Text>
          </View>
        }
        keyExtractor={(item, index) => item.id}
        renderItem={({ item }) => (
          <ContactItem
            id={item.id}
            name={item.name}
            phoneNumbers={item.phoneNumbers}
          />
        )}
      />
      <StatusBar
        style="light"
        backgroundColor={Colors[colorScheme ?? "light"].primaryColour}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
