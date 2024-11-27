const { defaultReciterPhoto } = require("../constants/images");

const getObjectFitClass = function (photo) {
  return photo === defaultReciterPhoto ? "object-contain p-2" : "object-cover";
};

export default getObjectFitClass;
