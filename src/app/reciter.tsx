import { useEffect, useState } from "react";
import { View, Linking, ActivityIndicator, FlatList } from "react-native";
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
import { useTranslate } from "../helpers/i18nHelper";
import ReciterHeader from "../components/Reciter/ReciterHeader";
import { useLocalSearchParams } from "expo-router";
import {
  IFavouriteBookmark,
  IReciter,
  IReciterRecitation,
} from "../types/types";

interface IFetchReciter {
  reciter: IReciter | null;
  loading: boolean;
  error: string | null;
}

interface IAlert {
  message: string;
  type: "success" | "error";
}

interface IFavouriteState {
  isFavourite: boolean;
  loading: boolean;
}

const ReciterScreen = () => {
  const { recitationSlug, reciterSlug } = useLocalSearchParams();
  const translate = useTranslate("ReciterScreen");
  const [state, setState] = useState<IFetchReciter>({
    reciter: null,
    loading: true,
    error: null,
  });

  const [selectedRecitationSlug, setSelectedRecitationSlug] = useState<string>(
    recitationSlug as string
  );
  const [recitations, setRecitations] = useState<IReciterRecitation[]>([]);
  const [favouriteState, setFavouriteState] = useState<IFavouriteState>({
    isFavourite: false,
    loading: true,
  });

  const [alert, setAlert] = useState<IAlert | null>(null);
  const [isChangingRecitation, setIsChangingRecitation] = useState(false);

  const currentRecitation = recitations?.find(
    (rec) => rec.recitationInfo.slug === selectedRecitationSlug
  );

  useEffect(() => {
    const fetchReciter = async () => {
      setState({
        reciter: null,
        loading: true,
        error: null,
      });
      try {
        const res = await getReciter({ reciterSlug: reciterSlug as string });

        if (!res.ok) {
          const data = await res.json();
          setState({ reciter: null, loading: false, error: data.message });
          return;
        }

        const data = await res.json();
        const reciterData = data.reciter || null;
        const recitationsData = reciterData?.recitations || [];

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
    const favoriteStatus = await isBookmarkExists(
      "Favorites",
      reciterSlug as string
    );
    setFavouriteState((prev) => ({
      ...prev,
      isFavourite: favoriteStatus,
      loading: false,
    }));
  };

  const handleFavoriteToggle = async () => {
    if (favouriteState.isFavourite) {
      try {
        await removeBookmark("Favorites", reciterSlug as string);
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
      const savedData: IFavouriteBookmark = {
        type: "Favorites",
        arabicName: state.reciter.arabicName,
        englishName: state.reciter.englishName,
        photo: state.reciter.photo,
        reciterSlug: reciterSlug as string,
        recitationSlug: selectedRecitationSlug as string,
      };
      try {
        await addBookmark("Favorites", reciterSlug as string, savedData);
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

  const downloadRecitation = (): void => {
    let downloadURL = `${BASE_END_POINT}/recitations/download/${reciterSlug}/${selectedRecitationSlug}`;

    state.reciter?.recitations?.forEach((rec) => {
      if (
        rec?.recitationInfo.slug === selectedRecitationSlug &&
        rec.downloadURL
      ) {
        downloadURL = rec.downloadURL;
      }
    });
    Linking.openURL(downloadURL);
  };

  const handleRecitationChange = (newRecitationSlug: string): void => {
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
      )}
    </View>
  );
};

export default ReciterScreen;
