import { View } from "react-native";
import getObjectFitClass from "./../../helpers/getObjectFitClass";
import { defaultReciterPhoto } from "../../constants/images";
import { Image } from "expo-image";

export default function ReciterImg({
  uri,
  alt = "Way2quran",
  otherClasses = "",
}) {
  const sizeClass = "w-[140px] h-[140px]";
  const imageUrl = uri || defaultReciterPhoto;

  return (
    <View
      className={`${sizeClass} rounded-full overflow-hidden border-2 border-gray-400`}
    >
      <Image
        source={{ uri: imageUrl }}
        width={140}
        height={140}
        contentFit={imageUrl === defaultReciterPhoto ? "contain" : "cover"}
        alt={alt}
        className={`${otherClasses} ${getObjectFitClass(uri)} w-full h-full`}
      />
    </View>
  );
}
