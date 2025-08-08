import React from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import CustomText from "../CustomText";

const NotFoundResults = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <CustomText className="" style={styles.title}>
          {t("noResultsFound")}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default NotFoundResults;
