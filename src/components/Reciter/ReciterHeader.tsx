import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { flexDirection } from "../../helpers/flexDirection";
import ReciterImg from "./ReciterImg";
import getName from "../../helpers/getName";
import SelectOptions from "./SelectOptions";
import TopReciterBadge from "./TopReciterBadge";
import GoBackButton from "./../ui/GoBackButton";
import {
  addBookmark,
  isBookmarkExists,
  removeBookmark,
} from "../../helpers/bookmarkHandlers";
import CustomText from "../CustomText";
import Alert from "../ui/Alert";
import { useTranslate } from "../../helpers/i18nHelper";

interface IFavouriteState {
  isFavourite: boolean;
  loading: boolean;
}

interface IAlert {
  message: string;
  type: "added" | "removed";
}

const ReciterHeader = ({
  reciter,
  currentRecitation,
  downloadRecitation,
  handleRecitationChange,
  selectedRecitationSlug,
  downloadTranslate,
}) => {
  const [alert, setAlert] = useState<IAlert | null>(null);
  const translate = useTranslate("ReciterScreen");
  const [favouriteState, setFavouriteState] = useState<IFavouriteState>({
    isFavourite: false,
    loading: true,
  });

  const handleFavoriteToggle = async () => {
    if (favouriteState.isFavourite) {
      await removeBookmark("Favorites", reciter.slug as string);
      setAlert({
        message: translate("removedFromFavorites"),
        type: "removed",
      });
    } else {
      const savedData = {
        type: "Favorites",
        arabicName: reciter.arabicName,
        englishName: reciter.englishName,
        photo: reciter.photo,
        reciterSlug: reciter.slug as string,
        recitationSlug: selectedRecitationSlug as string,
      };
      await addBookmark("Favorites", reciter.slug as string, savedData);
      setAlert({
        message: translate("addedToFavorites"),
        type: "added",
      });
    }
    setFavouriteState((prev) => ({
      ...prev,
      isFavourite: !prev.isFavourite,
      loading: false,
    }));
  };

  const checkIsFavourite = async () => {
    const favoriteStatus = await isBookmarkExists(
      "Favorites",
      reciter.slug as string
    );
    setFavouriteState({ isFavourite: favoriteStatus, loading: false });
  };

  useEffect(() => {
    checkIsFavourite();
  }, []);
  return (
    <View>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <View className={`${flexDirection()} items-center justify-between`}>
        <GoBackButton />
        <TouchableOpacity
          disabled={favouriteState.loading}
          onPress={handleFavoriteToggle}
          className="px-3 pt-3"
        >
          <AntDesign
            name="heart"
            size={35}
            color={favouriteState.isFavourite ? "#22c55e" : "#9ca3af"}
          />
        </TouchableOpacity>
      </View>
      <View className="reciter">
        {/* Reciter Info */}
        <View className="flex-col items-center w-full">
          <ReciterImg uri={reciter?.photo} alt={getName(reciter)} />
          <View className="mt-2">
            <CustomText className="px-2 pt-3 text-3xl font-semibold text-center text-slate-200">
              {getName(reciter)}
            </CustomText>
            {reciter?.isTopReciter && <TopReciterBadge />}
            <View className={`flex-row justify-center my-1`}>
              <Ionicons name="eye-outline" size={25} color="#6B7280" />
              <CustomText className="mx-1 text-lg font-semibold text-slate-300">
                {reciter?.totalViewers?.toLocaleString()}
              </CustomText>
            </View>
          </View>
        </View>

        {/* Select Options */}
        {reciter?.recitations?.length > 1 ? (
          <SelectOptions
            setRecitation={handleRecitationChange}
            recitations={reciter?.recitations}
            recitationName={getName(currentRecitation?.recitationInfo)}
          />
        ) : (
          <CustomText
            style={{ borderWidth: 1, borderRadius: 8, borderColor: "#4b5563" }}
            className="w-[90%] p-2 mx-auto text-2xl font-semibold text-center  text-gray-200"
          >
            {getName(currentRecitation?.recitationInfo)}
          </CustomText>
        )}
        {/* Download All Button */}
        <TouchableOpacity
          onPress={downloadRecitation}
          className="w-[95%] mx-auto p-3 mt-2 bg-gray-700 border border-gray-500 rounded-md"
        >
          <CustomText className="ml-2 text-lg font-semibold text-center text-slate-100">
            {downloadTranslate}
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(ReciterHeader);
