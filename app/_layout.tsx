import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
//@ts-ignore
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MagicModalPortal } from "react-native-magic-modal";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export { ErrorBoundary } from "expo-router";

export const unstable_settingss = {
  initialRouteName: "(tabs)",
};

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      networkMode: "offlineFirst",
    },
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: false,
      networkMode: "offlineFirst",
      staleTime: Infinity,
    },
  },
});
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 1000,
  retry: ({ persistedClient, error, errorCount }) => {
    console.log(persistedClient, error, errorCount);
    return persistedClient;
  },
});

// export const persistanceSquery = () => {
//   SQuery.dataStore = {
//     useStore: false,
//     updateTimeOut: 500,
//     setData: async (key, data) => {
//       try {
//         AsyncStorage.setItem(key, JSON.stringify(data));
//       } catch (error) {
//         console.error(error);
//       }
//     },
//     getData: async (key) => {
//       try {
//         return JSON.parse((await AsyncStorage.getItem(key)) || "");
//       } catch (error) {
//         console.error(error);
//         return null;
//       }
//     },
//   };
// };
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    // persistanceSquery();
    if (error) throw error;
  }, [error]);

  return (
    <>
      {/* Keep the splash screen open until the assets have loaded. In the future, we should just support async font loading with a native version of font-display. */}
      {!loaded && <SplashScreen />}
      {loaded && <RootLayoutNav />}
    </>
  );
}

function RootLayoutNav({ style }: any) {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: asyncStoragePersister,
          maxAge: 1000 * 60 * 60 * 12,
        }}
      >
        <MagicModalPortal />
        <SafeAreaProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{
                presentation: "modal",
                headerShown: false,
                animation: "fade_from_bottom",
              }}
            />
            <Stack.Screen
              name="messagerie"
              options={{
                presentation: "modal",
                headerShown: false,
                animation: "slide_from_right",
              }}
            />
            <Stack.Screen
              name="discussion"
              options={{
                presentation: "modal",
                headerShown: false,
                animation: "simple_push",
              }}
            />
            <Stack.Screen
              name="formTransaction"
              options={{
                presentation: "modal",
                headerShown: false,
                animation: "flip",
              }}
            />
            <Stack.Screen
              name="DetailTransaction"
              options={{
                presentation: "modal",
                headerShown: false,
                // headerTitle: "",
                animation: "slide_from_bottom",
              }}
            />

            <Stack.Screen
              name="register/login"
              options={{
                presentation: "modal",
                headerShown: false,
                headerTitle: "",
                title: "",
                animation: "flip",
              }}
            />

            <Stack.Screen
              name="register/signup"
              options={{
                presentation: "modal",
                headerShown: false,
                headerTitle: "",
                animation: "flip",
              }}
            />
          </Stack>
          <Toast />
        </SafeAreaProvider>
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
}
