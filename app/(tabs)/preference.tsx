import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MonoText } from "../../components/StyledText";
import { ScrollView, View } from "../../components/Themed";

import { useRouter } from "expo-router";

import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../fonctionUtilitaire/metrics";
import { Queries_Key } from "../../store";
import { CountryInterface } from "../../store/Descriptions";
import { usePreferenceStore } from "../../store/preference/preferenceSlice";
import { queryClient } from "../_layout";

const SECTIONS = [
  {
    header: "Profile",
    items: [
      { id: "name", icon: "user", label: "name", type: "select" },
      { id: "country", icon: "flag", label: "country", type: "select" },
      // { id: "phone", icon: "phone", label: "phone", type: "select" },
    ],
  },
  {
    header: "Preferences",
    items: [
      { id: "language", icon: "globe", label: "Language", type: "select" },
      { id: "currency", icon: "money-bill", label: "Currency", type: "select" },
      { id: "darkMode", icon: "moon", label: "Dark Mode", type: "toggle" },
    ],
  },
  {
    header: "Help",
    items: [{ id: "bug", icon: "bug", label: "Report Bug", type: "link" }],
  },
];

const PreferenceScreen = () => {
  const { setPreferences, language, currency, darkMode, name } =
    usePreferenceStore();

  const country = queryClient.getQueryData([
    Queries_Key.countries,
  ]) as CountryInterface[];

  // country.

  // const dispatch = useDispatch();
  // let preference = useSelector((state: RootState) => state.preference);
  // let rates = useSelector((state: RootState) => state.entreprise.rates);
  // console.log({ preference });
  // const country = useSelector((state: RootState) => state.country);
  let route = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: any }) => {
    const countr = country[item];
    if (!countr?.name) {
      return <></>;
    }
    return (
      <TouchableOpacity
        onPress={() => {
          setPreferences({
            country: { name: countr.name, id: countr._id },
            currency: countr.currency,
          });

          closeModal();
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: verticalScale(15),
        }}
      >
        <Image
          source={countr?.icon}
          contentFit="contain"
          style={{
            width: horizontalScale(30),
            height: verticalScale(30),
            marginRight: 5,
            // paddingVertical: moderateScale(15),
          }}
        />
        <MonoText style={{ fontSize: moderateScale(18) }}>
          {countr?.name}
        </MonoText>
        <MonoText style={{ marginLeft: 10 }}>{countr?.indicatif}</MonoText>
      </TouchableOpacity>
    );
  };

  const handleBackdropPress = () => {
    closeModal();
  };
  const handleModalPress = () => {
    // Do Nothing
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: horizontalScale(5),
          marginLeft: horizontalScale(18),
        }}
      >
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback onPress={handleModalPress}>
                <View
                  style={{
                    position: "absolute",
                    left: 5,
                    right: 5,
                    bottom: 1,
                    padding: moderateScale(10),
                    borderRadius: 10,
                    // backgroundColor: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <FlatList
                    //@ts-ignore
                    data={Object.keys(country)}
                    renderItem={renderItem}
                    keyExtractor={(item) => item}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Pressable
          onPress={() => {
            route.back();
          }}
        >
          {({ pressed }) => (
            <MaterialCommunityIcons
              name="arrow-left"
              color={"#333"}
              size={28}
              style={{
                opacity: pressed ? 0.5 : 1,
              }}
            />
          )}
        </Pressable>
        <MonoText style={{ fontSize: moderateScale(25) }}>Preferences</MonoText>
      </View>
      <ScrollView>
        {SECTIONS.map(({ header, items }) => (
          <View style={styles.section} key={header}>
            <View style={styles.sectionHeader}>
              <MonoText style={styles.sectionHeaderText}>{header}</MonoText>
            </View>
            <View style={styles.sectionBody}>
              {items.map(
                (
                  {
                    id,
                    label,
                    icon,
                    type,
                  }: { id: string; label: string; icon: string; type: string },
                  index
                ) => {
                  return (
                    <View
                      key={id}
                      style={[
                        styles.rowWrapper,
                        index === 0 && { borderTopWidth: 0 },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          // if (id === "currency") {
                          //   magicModal.show(() => <SetCurrencyModal />);
                          // }
                          if (id === "country") {
                            console.log("offrir");
                            // magicModal.show(() => <Setcountry />);
                            openModal();
                          }

                          console.log(id);
                        }}
                      >
                        <View style={styles.row}>
                          <FontAwesome5
                            color="#616161"
                            name={icon}
                            style={styles.rowIcon}
                            size={22}
                          />

                          <MonoText style={styles.rowLabel}>{label}</MonoText>

                          <View style={styles.rowSpacer} />

                          {type === "select" && (
                            <MonoText
                              ellipsizeMode="tail"
                              numberOfLines={1}
                              style={styles.rowValue}
                            >
                              {id === "country"
                                ? name
                                : //@ts-ignore
                                  preference[id]}
                            </MonoText>
                          )}

                          {type === "toggle" && (
                            <Switch
                              onChange={(val) => {
                                setPreferences({
                                  [id]: val.nativeEvent.value,
                                });
                              }}
                              //@ts-ignore
                              value={preference[id]}
                            />
                          )}

                          {(type === "select" || type === "link") && (
                            <FontAwesome5
                              color="#ababab"
                              name="chevron-right"
                              size={22}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }
              )}
            </View>
          </View>
        ))}
        <MonoText
          style={{
            marginTop: verticalScale(25),
            textAlign: "center",
            textDecorationLine: "underline",
            fontSize: moderateScale(15),
          }}
        >
          @JemsMoney
        </MonoText>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PreferenceScreen;
const styles = StyleSheet.create({
  section: {
    paddingTop: 12,
  },

  button: {
    fontSize: 18,
    color: "blue",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalButton: {
    fontSize: 16,
    color: "blue",
    alignSelf: "flex-end",
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: moderateScale(16),
    fontWeight: "600",

    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  sectionBody: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e3e3e3",
  },
  header: {
    paddingLeft: 24,
    paddingRight: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",

    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
  },
  profile: {
    // padding: 16,
    flexDirection: "column",
    alignItems: "center",
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: "#e3e3e3",
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
  },
  profileName: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "600",
  },
  profileEmail: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "400",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 24,
    height: 50,
  },
  rowWrapper: {
    paddingLeft: 24,

    borderTopWidth: 1,
    borderColor: "#e3e3e3",
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: "500",
    color: "#000",
  },
  rowValue: {
    fontSize: 17,
    color: "#616161",
    width: horizontalScale(120),
    marginRight: 4,
    justifyContent: "flex-end",
    // alignSelf: "flex-end",
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
});
