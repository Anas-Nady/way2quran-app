import { View } from "react-native";
import getObjectFitClass from "./../../helpers/getObjectFitClass";
import { defaultReciterPhoto } from "../../constants/images";
import { Image } from "expo-image";

interface ReciterImgProps {
  uri: string;
  alt: string;
}

export default function ReciterImg({
  uri,
  alt = "Way2quran",
}: ReciterImgProps) {
  const sizeClass = "w-[140px] h-[140px]";
  const imageUrl = uri || defaultReciterPhoto;

  return (
    <View
      className={`${sizeClass} rounded-full overflow-hidden border border-gray-500`}
    >
      <Image
        source={{ uri: imageUrl }}
        contentFit={imageUrl === defaultReciterPhoto ? "contain" : "cover"}
        alt={alt}
        className={`${getObjectFitClass(uri)}`}
        style={{ width: 140, height: 140 }}
      />
    </View>
  );
}
