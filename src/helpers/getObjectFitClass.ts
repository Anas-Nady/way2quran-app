import { defaultReciterPhoto } from "../constants/images";

const getObjectFitClass = function (photo: string) {
  return photo === defaultReciterPhoto ? "object-contain p-2" : "object-cover";
};

export default getObjectFitClass;
