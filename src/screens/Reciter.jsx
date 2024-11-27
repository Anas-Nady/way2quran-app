import { useEffect, useState } from "react";
import { View, Linking, ActivityIndicator, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import SurahCardDetails from "../components/Surah/SurahCardDetails";
import { BASE_END_POINT, getReciter } from "../services/api";
import Error from "../components/States/Error";
import LoadingSpinner from "../components/States/LoadingSpinner";
import {
  addBookmark,
  removeBookmark,
  isBookmarkExists,
} from "../helpers/bookmarkHandlers";
import Alert from "../components/ui/Alert";
import { useTranslate } from "./../helpers/i18nHelper.js";
import ReciterHeader from "../components/Reciter/ReciterHeader.jsx";

const ReciterScreen = () => {
  const route = useRoute();
  const { recitationSlug, reciterSlug } = route.params || {};
  const translate = useTranslate("ReciterScreen");
  const [state, setState] = useState({
    reciter: {},
    loading: true,
    error: null,
  });

  const [selectedRecitationSlug, setSelectedRecitationSlug] =
    useState(recitationSlug);
  const [recitations, setRecitations] = useState([]);
  const [favouriteState, setFavouriteState] = useState({
    isFavourite: false,
    loading: true,
  });

  const [alert, setAlert] = useState(null);
  const [isChangingRecitation, setIsChangingRecitation] = useState(false);

  const currentRecitation = recitations?.find(
    (rec) => rec.recitationInfo.slug === selectedRecitationSlug
  );

  useEffect(() => {
    const fetchReciter = async () => {
      setState({
        reciter: {},
        loading: true,
        error: null,
      });
      try {
        const res = await getReciter(reciterSlug);

        if (!res.ok) {
          const data = await res.json();
          setState({ reciter: null, loading: false, error: data.message });
          return;
        }

        const data = await res.json();
        const reciterData = data.reciter || {};
        const recitationsData = reciterData.recitations || [];

        setState({ reciter: reciterData, loading: false, error: null });
        setRecitations(recitationsData);

        if (!selectedRecitationSlug && recitationsData.length > 0) {
          setSelectedRecitationSlug(recitationsData[0]?.recitationInfo?.slug);
        }
      } catch (error) {
        setState({ reciter: null, loading: false, error: error.message });
      }
    };

    fetchReciter();
    checkFavoriteStatus();
  }, [reciterSlug, recitationSlug]);

  const checkFavoriteStatus = async () => {
    const favoriteStatus = await isBookmarkExists("Favorites", reciterSlug);
    setFavouriteState((prev) => ({
      ...prev,
      isFavourite: favoriteStatus,
      loading: false,
    }));
  };

  const handleFavoriteToggle = async () => {
    if (favouriteState.isFavourite) {
      try {
        await removeBookmark("Favorites", reciterSlug);
        setAlert({
          message: translate("removedFromFavorites"),
          type: "success",
        });
      } catch (error) {
        setAlert({
          message: error?.message || "An error occurred. Please try again.",
          type: "error",
        });
      }
    } else {
      const savedData = {
        type: "Favorites",
        arabicName: state.reciter.arabicName,
        englishName: state.reciter.englishName,
        photo: state.reciter.photo,
        reciterSlug,
        recitationSlug: selectedRecitationSlug,
      };
      try {
        await addBookmark("Favorites", reciterSlug, savedData);
        setAlert({
          message: translate("addedToFavorites"),
          type: "success",
        });
      } catch (error) {
        setAlert({
          message: error?.message || "An error occurred. Please try again.",
          type: "error",
        });
      }
    }
    setFavouriteState((prev) => ({
      ...prev,
      isFavourite: !prev.isFavourite,
      loading: false,
    }));
  };

  const downloadRecitation = () => {
    const downloadUrl = `${BASE_END_POINT}/reciters/download-recitation/${reciterSlug}/${selectedRecitationSlug}`;
    Linking.openURL(downloadUrl);
  };

  const handleRecitationChange = (newRecitationSlug) => {
    setIsChangingRecitation(true);
    setSelectedRecitationSlug(newRecitationSlug);

    // Simulate loading time
    setTimeout(() => {
      setIsChangingRecitation(false);
    }, 100);
  };

  const renderSurahItem = ({ item, index }) => (
    <SurahCardDetails
      surah={item}
      surahIndex={index}
      recitation={currentRecitation}
      reciter={{
        photo: state.reciter?.photo,
        arabicName: state.reciter.arabicName,
        englishName: state.reciter.englishName,
        slug: state.reciter?.slug,
      }}
    />
  );

  return (
    <View
      style={{ position: "relative" }}
      className="flex-1 w-full mx-auto bg-slate-800"
    >
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      {state.loading ? (
        <LoadingSpinner />
      ) : state.error ? (
        <Error message={state.error} />
      ) : (
        <>
          <>
            {isChangingRecitation ? (
              <View className="flex items-center justify-center py-10">
                <ActivityIndicator size="large" color="#22c55e" />
              </View>
            ) : (
              <FlatList
                data={currentRecitation?.audioFiles}
                keyExtractor={(item) => item?.surahInfo?.slug}
                ListHeaderComponent={
                  <ReciterHeader
                    reciter={state.reciter}
                    currentRecitation={currentRecitation}
                    favouriteState={favouriteState}
                    downloadRecitation={downloadRecitation}
                    handleRecitationChange={handleRecitationChange}
                    handleFavoriteToggle={handleFavoriteToggle}
                    downloadTranslate={translate("downloadAll")}
                  />
                }
                renderItem={renderSurahItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  backgroundColor: "#1e293b",
                  width: "100%",
                }}
              />
            )}
          </>
        </>
      )}
    </View>
  );
};

export default ReciterScreen;
