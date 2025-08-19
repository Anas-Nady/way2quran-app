import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import MushafCard from "../components/MushafCard";
import HeadingWithBackButton from "../components/ui/HeadingWithBackButton";
import { getMushafs } from "../services/api";
import LoadingSpinner from "../components/States/LoadingSpinner";
import Error from "../components/States/Error";

export default function DownloadMushaf() {
  const { t } = useTranslation();
  const [state, setState] = useState({
    loading: false,
    error: null,
    mushafs: [],
  });

  useEffect(() => {
    const fetchMushafs = async () => {
      try {
        // Simulate fetching data
        setState((prev) => ({ ...prev, loading: true }));
        // Here you would typically fetch from an API
        const response = await getMushafs();

        if (response.status !== 200) {
          setState((prev) => ({
            ...prev,
            error: t("fetchError"),
            loading: false,
          }));
          return;
        }
        const { data } = await response.json();

        setState((prev) => ({ ...prev, mushafs: data, loading: false }));
      } catch (error) {
        setState((prev) => ({ ...prev, error: error.message, loading: false }));
      }
    };
    fetchMushafs();
  }, []);

  if (state.loading) {
    return <LoadingSpinner />;
  }

  if (state.error) {
    return <Error message={state?.error || t("fetchError")} />;
  }

  return (
    <View className="flex-1 w-full h-full mx-auto bg-gray-800">
      <FlatList
        data={state.mushafs}
        ListHeaderComponent={
          <HeadingWithBackButton headingText={t("downloadMushaf")} />
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.slug}
        renderItem={({ item }) => <MushafCard mushaf={item} />}
        contentContainerStyle={{
          backgroundColor: "#1f2937",
        }}
      />
    </View>
  );
}
