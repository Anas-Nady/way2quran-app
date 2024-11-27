export const HAFS_AN_ASIM = "hafs-an-asim";
export const COMPLETED_RECITATIONS = "full-holy-quran";
export const VARIOUS_RECITATIONS = "various-recitations";

const getRecitationType = (slug) => {
  if (slug === COMPLETED_RECITATIONS || slug === VARIOUS_RECITATIONS) {
    return HAFS_AN_ASIM;
  }
  return slug;
};

export default getRecitationType;
