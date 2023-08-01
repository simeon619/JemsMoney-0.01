import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/build/Entypo";
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { memo } from "react";
import { Pressable, useColorScheme, useWindowDimensions } from "react-native";

import { MonoText } from "../../components/StyledText";
import { View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../fonctionUtilitaire/metrics";

import { AntDesign } from "@expo/vector-icons";

import { Queries_Key } from "../../store";
import { AccountInterface } from "../../store/Descriptions";
import { queryClient } from "../_layout";
import EventScreen from "./event";
import Home from "./index";
import PreferenceScreen from "./preference";
import TabTwoScreen from "./two";
export function DrawerItemIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
const Drawer = createDrawerNavigator();

const CustomDrawerContent = memo((props: any) => {
  // const { account } = useSelector((state: RootState) => state.auth);
  const account = queryClient.getQueryData([
    Queries_Key.user,
  ]) as AccountInterface;
  const { height, width } = useWindowDimensions();

  return (
    <View lightColor="#21263a" darkColor="#21263a" style={{ flex: 1 }}>
      <DrawerContentScrollView
        style={{ margin: horizontalScale(20), height }}
        {...props}
      >
        <Image
          style={{
            width: horizontalScale(65),
            marginBottom: horizontalScale(15),
            aspectRatio: 1,
            alignSelf: "flex-start",
            marginLeft: horizontalScale(10),
          }}
          source={require("../../assets/images/user.png")}
        />
        <MonoText
          numberOfLines={3}
          ellipsizeMode="tail"
          lightColor="#eee"
          darkColor="#eee"
          style={{
            fontSize: moderateScale(35),
            textAlign: "left",
            marginLeft: horizontalScale(10),
          }}
        >
          {account?.name}
        </MonoText>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <Pressable
        style={{
          position: "absolute",
          bottom: 10,
          paddingVertical: verticalScale(10),
          left: horizontalScale(20),
          flexDirection: "row",
          gap: horizontalScale(20),
        }}
        onPress={() => {
          queryClient.removeQueries();
        }}
      >
        <Entypo name="log-out" size={28} color={"#eee"} />
        <MonoText
          lightColor="#eee"
          style={{
            fontSize: moderateScale(20),
          }}
        >
          Logout
        </MonoText>
      </Pressable>
      <MonoText
        lightColor="#eee"
        style={{
          position: "absolute",
          bottom: 60,
          left: horizontalScale(20),
          fontSize: moderateScale(20),
        }}
      >
        1RUB = 7.8XOF
      </MonoText>
    </View>
  );
});

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  let router = useRouter();
  return (
    <Drawer.Navigator
      drawerContent={(props: any) => {
        return <CustomDrawerContent {...props} />;
      }}
      initialRouteName="index"
      screenOptions={{
        drawerActiveTintColor: Colors[colorScheme ?? "light"].textDrawer,
        drawerInactiveTintColor: Colors[colorScheme ?? "light"].textGray,
        // headerTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Drawer.Screen
        name="index"
        component={Home}
        options={{
          title: "home",
          headerTitle: "",
          drawerIcon: ({ color }) => (
            <DrawerItemIcon name="home" color={color} />
          ),
          drawerItemStyle: { marginTop: verticalScale(35) },
          headerRight: () => (
            <Pressable
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
              }}
              onPress={() => {
                router.push("/modal");
              }}
            >
              {/* <MonoText
                style={{
                  color: Colors[colorScheme ?? "light"].text,
                  fontSize: moderateScale(16),
                }}
              >
                Find contact
              </MonoText> */}

              <AntDesign
                name="contacts"
                size={28}
                color={Colors[colorScheme ?? "light"].text}
                style={{ marginRight: 25 }}
              />
            </Pressable>
          ),
        }}
      />
      <Drawer.Screen
        name="two"
        component={TabTwoScreen}
        options={{
          title: "Statistics",
          headerTitle: "",
          drawerIcon: ({ color }) => (
            <DrawerItemIcon name="exchange" color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="arrow-left"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="event"
        component={EventScreen}
        options={{
          title: "Events",
          headerTitle: "",
          drawerIcon: ({ color }) => (
            <DrawerItemIcon name="gamepad" color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="arrow-left"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Drawer.Screen
        name="preference"
        component={PreferenceScreen}
        options={{
          title: "Preferences",
          headerShown: false,
          headerTitle: "",
          drawerIcon: ({ color }) => (
            <DrawerItemIcon name="stethoscope" color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="arrow-left"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
