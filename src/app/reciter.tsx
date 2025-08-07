import React, { useEffect, useState } from "react";
import { View, Linking, ActivityIndicator, FlatList } from "react-native";
import SurahCardDetails from "../components/Surah/SurahCardDetails";
import { BASE_END_POINT, getReciter } from "../services/api";
import Error from "../components/States/Error";
import LoadingSpinner from "../components/States/LoadingSpinner";
import Alert from "../components/ui/Alert";
import { useTranslate } from "../helpers/i18nHelper";
import ReciterHeader from "../components/Reciter/ReciterHeader";
import { useLocalSearchParams } from "expo-router";
import { IReciter, IReciterRecitation } from "../types/types";

interface IFetchReciter {
  reciter: IReciter | null;
  loading: boolean;
  error: string | null;
}

interface IAlert {
  message: string;
  type: "success" | "error";
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
  }, [reciterSlug, recitationSlug]);

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
  // Main render logic
  if (state.loading) {
    return <LoadingSpinner />;
  }

  if (state.error) {
    return <Error message={state.error} />;
  }

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

      <>
        {isChangingRecitation ? (
          <View className="flex items-center justify-center py-10">
            <ActivityIndicator size="large" color="#22c55e" />
          </View>
        ) : (
          <FlatList
            ListHeaderComponent={() => (
              <ReciterHeader
                reciter={state.reciter}
                currentRecitation={currentRecitation}
                selectedRecitationSlug={selectedRecitationSlug}
                downloadRecitation={downloadRecitation}
                handleRecitationChange={handleRecitationChange}
                downloadTranslate={translate("downloadAll")}
              />
            )}
            data={currentRecitation?.audioFiles}
            keyExtractor={(item) => item?.surahInfo?.slug}
            renderItem={renderSurahItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              backgroundColor: "#1e293b",
            }}
          />
        )}
      </>
    </View>
  );
};

export default ReciterScreen;
