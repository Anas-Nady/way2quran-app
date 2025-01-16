import { useTranslation } from "react-i18next";

export const useTranslate = (namespace: string) => {
  const { t } = useTranslation();
  return (key: string) => t(`${namespace}.${key}`);
};
