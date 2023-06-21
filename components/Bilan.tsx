import React from "react";
import {
  View as ViewNatif,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { ScrollView, Text, View } from "../components/Themed";
import { data } from "../fonctionUtilitaire/data";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../fonctionUtilitaire/metrics";
import { MonoText } from "./StyledText";
const HEIGHT_BAR = 6;
const Bilan = () => {
  const colorScheme = useColorScheme();
  const { height, width } = useWindowDimensions();
  return (
    <View
      style={{
        width,
        height: verticalScale(200),
      }}
      lightColor="#f7f8fc"
    >
      {/* <Text
      lightColor="#777"
      style={{
        fontSize: moderateScale(22),
        paddingLeft: horizontalScale(20),
        backgroundColor: Colors[colorScheme ?? "light"].background,
      }}
    >
      Bilan
    </Text> */}
      <ScrollView
        horizontal={true}
        lightColor="#fff"
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: "center" }}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
      >
        {data.map((item, index) => (
          <View
            lightColor="#f7f8fc"
            key={index}
            style={[
              {
                flex: 1,
                width: width - horizontalScale(115),
                marginHorizontal: 15,
                aspectRatio: 2,
                overflow: "hidden",
                alignItems: "center",
                borderRadius: moderateScale(5),
              },
              shadow(10),
            ]}
          >
            <ViewNatif
              style={{
                // marginTop: 1,
                alignSelf: "flex-start",
                marginLeft: 10,
                width: width / 1.5,
              }}
            >
              <MonoText
                lightColor="#444"
                style={{
                  fontSize: moderateScale(28),
                  fontWeight: "600",
                }}
              >
                {item.title}
              </MonoText>
              <ViewNatif
                style={{
                  flexDirection: "row",
                  alignItems: "baseline",
                  marginLeft: horizontalScale(10),
                }}
              >
                <MonoText
                  style={{ fontSize: moderateScale(25), fontWeight: "300" }}
                >
                  CFA
                </MonoText>
                <Text
                  style={{ fontSize: moderateScale(45), fontWeight: "300" }}
                >
                  {item.montant}
                </Text>
              </ViewNatif>
            </ViewNatif>
            <View
              style={{
                flexDirection: "row",
                width: "90%",
                height: verticalScale(HEIGHT_BAR),
                alignSelf: "center",
                position: "absolute",
                bottom: verticalScale(10),
                backgroundColor: "transparent",
              }}
            >
              <View
                style={{
                  height: verticalScale(HEIGHT_BAR),
                  flexGrow: 0.5,
                  borderTopLeftRadius: 2,
                  borderBottomLeftRadius: 2,
                }}
                lightColor={item.color}
                darkColor={item.color}
              />
              <View
                style={{
                  height: verticalScale(HEIGHT_BAR),
                  flexGrow: 1,
                  borderTopRightRadius: 2,
                  borderBottomRightRadius: 2,
                }}
                lightColor={"#ccc"}
                darkColor={"#ccc"}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Bilan;
