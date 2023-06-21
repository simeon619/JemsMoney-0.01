import { Image, ImageLoadEventData } from "expo-image";
import React, { useState } from "react";
import { useWindowDimensions } from "react-native";
const ImageRatio = ({
  uri,
  ratio,
}: {
  uri: string | undefined;
  ratio: number;
}) => {
  const [aspectRatio, setAspectRatio] = useState(2 / 3);
  const [imagePath, setImagePath] = useState<string>("");
  const { height, width } = useWindowDimensions();
  const handleImageLoad = (event: ImageLoadEventData) => {
    const { width, height } = event.source;
    const imageAspectRatio = width / (height || 1);
    setAspectRatio(imageAspectRatio);
  };

  const imageSource = { uri };
  console.log("🚀 ~ file: ImageRatio.tsx:23 ~ imageSource:", imageSource);

  // useEffect(() => {
  //   const fetchImage = async () => {
  //     // const response = await fetch(uri);
  //     // const base64String = await response.text();
  //     // console.log({ base64String });

  //     let ext = uri?.split(".").pop();
  //     let path = FileSystem.documentDirectory + `image-${Date.now()}.${ext}`;
  //     // await FileSystem.writeAsStringAsync(path, base64String, {
  //     //   encoding: FileSystem.EncodingType.Base64,
  //     // });

  //     setImagePath(path);
  //     console.log("Write SUCCEFELY2");
  //   };

  //   // fetchImage();
  // }, []);
  // if (imageSource.uri)
  return (
    <Image
      contentFit="cover"
      source={imageSource}
      style={{
        width: "100%",
        maxHeight: height / ratio,
        aspectRatio: aspectRatio !== null ? aspectRatio : 2 / 3,
      }}
      onLoad={handleImageLoad}
    />
  );
};
export default ImageRatio;
