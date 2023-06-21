import { AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from "react";
import { Pressable, useColorScheme, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { View } from "../components/Themed";
import Colors from "../constants/Colors";
import { HOST } from "../constants/data";
import { horizontalScale, moderateScale } from "../fonctionUtilitaire/metrics";
import { MonoText } from "./StyledText";
const InstanceAudio = ({ voiceUrl }: { voiceUrl: any }) => {
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [audioPath, setAudioPath] = useState<string>("");
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioPosition, setAudioPosition] = useState(0);
  const [progress, setProgress] = useState<number>();

  let { width, height } = useWindowDimensions();
  const tooglePlay = () => {
    setIsPlay((prev) => !prev);
  };

  console.log({ voiceUrl });

  // let audioPath = useRef<string>("").current;
  useEffect(() => {
    const fetchAudio = async () => {
      const response = await fetch(HOST + voiceUrl);
      const base64String = await response.text();

      let path = FileSystem.documentDirectory + `voice-${Date.now()}.m4a`;
      await FileSystem.writeAsStringAsync(path, base64String, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setAudioPath(path);
      console.log("Write SUCCEFELY2");
    };

    fetchAudio();
    return () => {
      // if (sound) {
      //     await sound.stopAsync();
      //     await sound.unloadAsync();
      //     setSound(undefined);
      //     console.log("reset sound");
      //   }
      // setSound(undefined);
    };
  }, []);

  useEffect(() => {
    const initAudio = async () => {
      console.log("Loading Sound");

      const { sound, status } = await Audio.Sound.createAsync({
        uri: audioPath,
      });
      setSound(sound);
      if (status.isLoaded) {
        setAudioDuration(status.durationMillis || 0);
        // setAudioPosition(status.durationMillis || 0);
      }
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setAudioPosition(() =>
            status.positionMillis === 0
              ? status.durationMillis || 0
              : status.positionMillis
          );

          if (status.didJustFinish) {
            sound.setPositionAsync(0);
            setIsPlay(false);
            setAudioPosition(0);
          }
        }
      });
    };

    if (audioPath) {
      initAudio();
    }
  }, [audioPath]);

  useEffect(() => {
    if (audioPath) {
      if (isPlay) {
        playSound();
      } else {
        pauseSound();
      }
    }
  }, [isPlay, audioPath]);
  function formatDuration(durationMillis: number) {
    const totalSeconds = Math.floor(durationMillis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  async function playSound() {
    console.log("Playing Sound");
    await sound?.playAsync();
  }

  async function pauseSound() {
    try {
      console.log("Pausing Sound");
      await sound?.pauseAsync();
    } catch (err) {
      console.error("Failed to pause sound", err);
    }
  }
  let colorsSheme = useColorScheme();
  const widthAnim = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    widthAnim.value = withSpring(
      (audioPosition / audioDuration || 1) * (width - width / 3),
      {
        // damping: 10, // Réduisez la valeur de l'amortissement pour un mouvement plus fluide
        // stiffness: 20, // Augmentez la rigidité pour un mouvement plus réactif
        // mass: 10, // Réduisez la masse pour un mouvement plus rapide
        // overshootClamping: true,
        // restDisplacementThreshold: 1,
        // restSpeedThreshold: 1,
      }
    );
    return {
      width: widthAnim.value,
    };
  });
  console.log({ audioDuration, audioPosition });
  return (
    <>
      {audioPath && (
        <View
          style={{
            width: width - horizontalScale(width / 3),
            // height: verticalScale(2),

            // backgroundColor: "#cce",
            justifyContent: "space-between",
            alignItems: "center",

            flexDirection: "row",
            borderRadius: 15,
            overflow: "hidden",
            paddingHorizontal: horizontalScale(10),
          }}
        >
          <Animated.View
            style={[
              {
                backgroundColor: "#aaa8",
                // width:
                //   (width - horizontalScale(width / 3)) *
                //   (audioPosition / audioDuration || 1),
                height: "100%",
                position: "absolute",
                // left: 10,
                borderRadius: 99,
                marginLeft: horizontalScale(2),
                alignSelf: "flex-end",
                // paddingHorizontal: horizontalScale(10),
              },
              animatedStyle,
            ]}
          />
          <Pressable onPress={tooglePlay} style={{ padding: moderateScale(5) }}>
            {isPlay ? (
              <AntDesign
                name="pausecircle"
                size={30}
                color={Colors[colorsSheme ?? "light"].primaryColour}
              />
            ) : (
              <AntDesign
                name="play"
                size={30}
                color={Colors[colorsSheme ?? "light"].primaryColour}
              />
            )}
          </Pressable>
          <MonoText
            style={{
              fontSize: moderateScale(15),
              color: Colors[colorsSheme ?? "light"].primaryColour,
              fontWeight: "600",
            }}
          >
            {formatDuration(audioPosition)}
          </MonoText>
        </View>
      )}
    </>
  );
};

export default InstanceAudio;
