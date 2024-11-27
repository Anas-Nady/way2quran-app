import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import getName from "../../helpers/getName";

export default function SelectOptions({
  setRecitation,
  recitations,
  recitationName,
}) {
  const { t } = useTranslation();

  const selectListStyles = {
    boxStyles: {
      borderColor: "#4B5563",
      flex: 1,
      borderRadius: 8,
      backgroundColor: "#374151",
      position: "relative",
      flexDirection: "row",
    },
    inputStyles: {
      color: "#E5E7EB",
      fontSize: 18,
      fontWeight: "bold",
    },
    dropdownStyles: {
      borderColor: "#4B5563",
      backgroundColor: "#1F2937",
      position: "relative",
      width: "100%",
    },
    dropdownItemStyles: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#4B5563",
    },
    dropdownTextStyles: {
      color: "#E5E7EB",
      fontSize: 18,
      fontWeight: "bold",
    },
  };

  const recitationOptions = recitations?.map((rec) => ({
    key: rec?.recitationInfo?.slug,
    value: getName(rec?.recitationInfo),
  }));

  return (
    <View className="mx-auto mb-2 w-[80%]">
      <SelectList
        setSelected={(val) => setRecitation(val)}
        data={recitationOptions}
        search={false}
        save="key"
        placeholder={recitationName || t("chooseTypeOfRecitation")}
        {...selectListStyles}
      />
    </View>
  );
}
