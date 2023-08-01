// import { useRouter } from "expo-router";
// import React from "react";

// //@ts-ignore
// import { Entypo } from "@expo/vector-icons";
// import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
// import { Image } from "expo-image";
// import { FlatList, TouchableOpacity, useColorScheme } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useSelector } from "react-redux";
// import { MonoText } from "../components/StyledText";
// import { View } from "../components/Themed";
// import {
//   horizontalScale,
//   moderateScale,
//   shadow,
//   verticalScale,
// } from "../fonctionUtilitaire/metrics";
// import { RootState } from "../store";
// const messagerie = () => {
//   const { open, close } = useSelector((state: RootState) => state.discussion);
//   //   router.back();
//   // }
//   let router = useRouter();

//   console.log(open);

//   // open?.forEach((r) => {
//   //   console.log(r, "rrrr");
//   // });
//   const colorScheme = useColorScheme();
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <View
//         style={{
//           paddingHorizontal: horizontalScale(25),
//           // paddingTop: verticalScale(10),
//           flex: 1,
//         }}
//       >
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <MonoText style={{ fontSize: moderateScale(28), fontWeight: "600" }}>
//             Discusions
//           </MonoText>
//           <FontAwesome5 name="ellipsis-h" size={20} color="grey" />
//         </View>
//         <View style={{}}>
//           <View
//             style={{
//               flexDirection: "row",
//               gap: 5,
//               alignItems: "center",
//               paddingVertical: verticalScale(25),
//             }}
//           >
//             <Entypo name="pin" size={24} color="black" />
//             <MonoText>Open Discussion</MonoText>
//           </View>
//           <FlatList
//             data={Object.values(open)}
//             keyExtractor={(item) => item.discussionId}
//             renderItem={({ item }) => (
//               <ItemDiscussion item={item} router={router} />
//             )}
//           />
//         </View>
//         <View style={{ flex: 1 }}>
//           <View
//             style={{
//               flexDirection: "row",
//               gap: 5,
//               alignItems: "center",
//               paddingVertical: verticalScale(25),
//             }}
//           >
//             <Entypo name="new-message" size={24} color="black" />
//             <MonoText>Closed Discussions</MonoText>
//           </View>
//           <FlatList
//             data={Object.values(close)}
//             keyExtractor={(item) => item.discussionId}
//             renderItem={({ item }) => (
//               <ItemDiscussion item={item} router={router} />
//             )}
//           />
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const ItemDiscussion = ({ item, router }: any) => {
//   const { discussionId, manager, user } = item;

//   if (!discussionId || (!manager && !user)) {
//     return null;
//   }
//   return (
//     <TouchableOpacity
//       onPress={() => {
//         router.push({
//           pathname: "/discussion",
//           params: { id: discussionId },
//         });
//       }}
//       onLongPress={() => {}}
//       style={[
//         {
//           flexDirection: "row",
//           alignItems: "center",
//         },
//         shadow(1),
//       ]}
//     >
//       <View style={{}}>
//         <Image
//           source={require("../assets/images/user.png")}
//           style={{
//             height: verticalScale(70),
//             aspectRatio: 1,
//             borderRadius: 99,
//             marginRight: 10,
//           }}
//         />
//       </View>

//       <View style={{ flex: 1 }}>
//         <View
//           style={{
//             flexDirection: "row",
//             marginBottom: 5,
//           }}
//         >
//           <MonoText
//             style={{
//               fontWeight: "bold",
//               flex: 1,
//               // color: "black",
//               fontSize: moderateScale(18),
//             }}
//             numberOfLines={1}
//           >
//             AGENT X
//           </MonoText>
//         </View>
//         <MonoText
//           style={{
//             color: "grey",
//           }}
//           numberOfLines={2}
//         >
//           Go Discut with agent for transaction
//         </MonoText>
//       </View>
//     </TouchableOpacity>

//     // <View>
//     //   <MonoText>{item.user?.telephone}</MonoText>
//     // </View>
//   );
// };

// export default messagerie;
// // const ResponseModal = ({ router }: any) => {
// //   const colorScheme = useColorScheme();

// //   let canGoBack = false;
// //   useEffect(() => {
// //     if (canGoBack) {
// //       router.back();
// //     }
// //     canGoBack = true;
// //     return () => {
// //       if (canGoBack === true) {
// //         router.back();
// //       }
// //     };
// //   }, []);
// //   return (
// //     <View style={{ width: "90%", alignSelf: "center" }}>
// //       <TouchableOpacity
// //         onPress={() => {
// //           magicModal.hide();
// //           return router.replace("/discussion");
// //         }}
// //         style={[shadow(90), { paddingVertical: verticalScale(5) }]}
// //       >
// //         <MonoText
// //           style={{
// //             textAlign: "center",
// //             fontSize: moderateScale(16),
// //             color: Colors[colorScheme ?? "light"].primaryColour,
// //             borderBottomColor: "#ccc",
// //             borderBottomWidth: 0.3,
// //           }}
// //         >
// //           Create a new discussion with agent
// //         </MonoText>
// //       </TouchableOpacity>

// //       <TouchableOpacity
// //         onPress={() => {
// //           canGoBack = false;
// //           return magicModal.hide();
// //         }}
// //         style={[shadow(90), { paddingVertical: verticalScale(15) }]}
// //       >
// //         <MonoText
// //           style={{
// //             textAlign: "center",
// //             fontSize: moderateScale(16),
// //             color: Colors[colorScheme ?? "light"].primaryColour,
// //             borderBottomColor: "#ccc",
// //             borderBottomWidth: 0.3,
// //             // alignSelf: "center",
// //           }}
// //         >
// //           See old discussion
// //         </MonoText>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };
