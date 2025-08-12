import React from "react";
import { Image } from "expo-image";
import { defaultReciterPhoto } from "../../constants/images";
import getObjectFitClass from "../../helpers/getObjectFitClass";

const CustomImage = ({ uri, alt, dimensions }) => {
  return (
    <Image
      source={{ uri }}
      contentFit={uri === defaultReciterPhoto ? "contain" : "cover"}
      alt={alt}
      className={`border border-gray-600 rounded-full ${getObjectFitClass(
        uri
      )}`}
      style={{ width: dimensions, height: dimensions }}
    />
  );
};

export default CustomImage;
