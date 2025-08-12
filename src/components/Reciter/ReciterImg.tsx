import React from "react";
import { defaultReciterPhoto } from "../../constants/images";
import CustomImage from "../ui/CustomImage";

interface ReciterImgProps {
  uri: string;
  alt: string;
}

export default function ReciterImg({
  uri,
  alt = "Way2quran",
}: ReciterImgProps) {
  const imageUrl = uri || defaultReciterPhoto;

  return <CustomImage uri={imageUrl} alt={alt} dimensions={150} />;
}
