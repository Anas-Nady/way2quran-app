import { useTranslation } from "react-i18next";

export const useTranslate = (namespace) => {
  const { t } = useTranslation();
  return (key) => t(`${namespace}.${key}`);
};
