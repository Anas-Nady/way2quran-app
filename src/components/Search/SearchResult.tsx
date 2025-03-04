import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Error from "../States/Error";
import EmptyState from "../States/EmptyState";
import LoadingSpinner from "../States/LoadingSpinner";
import { useTranslate } from "../../helpers/i18nHelper";
import getName from "../../helpers/getName";
import { useRouter } from "expo-router";
import { IDynamicSearchParams } from "../../types/types";

export default function SearchResult({ results, loading, error }) {
  const translate = useTranslate("SearchScreen");
  const router = useRouter();

  const renderResults = (items, pathPrefix, params) =>
    items.map((item, index) => {
      const dynamicParams: IDynamicSearchParams = {};

      if (params.reciterSlug && params.recitationSlug) {
        dynamicParams.reciterSlug = item.slug;
        dynamicParams.recitationSlug = item.recitationSlug;
      } else if (params.recitationSlug) {
        dynamicParams.recitationSlug = item.slug;
      } else if (params.surahNumber) {
        dynamicParams.pageNumber = item.pageNumber;
      }

      return (
        <TouchableOpacity
          key={index}
          onPress={() =>
            router.push({
              pathname: pathPrefix,
              params: dynamicParams,
            })
          }
          className="block px-2 py-3"
          role="button"
        >
          <Text className="pt-1 pb-2 text-xl font-medium text-center text-gray-100 border-b border-gray-500">
            {getName(item)}
          </Text>
        </TouchableOpacity>
      );
    });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error message={error?.message || translate("fetchError")} />;
  }

  const noDataFound =
    results.reciters.length === 0 &&
    results.recitations.length === 0 &&
    results.surahs.length === 0;

  if (noDataFound) {
    return <EmptyState message={translate("emptyState")} />;
  }

  return (
    <View className="w-[90%] flex-1 mx-auto mt-2">
      <View className="">
        {results.reciters.length > 0 &&
          renderResults(results.reciters, "/reciter", {
            reciterSlug: true,
            recitationSlug: true,
          })}
        {results.recitations.length > 0 &&
          renderResults(results.recitations, "/reciters", {
            recitationSlug: true,
          })}
        {results.surahs.length > 0 &&
          renderResults(results.surahs, "/surah", { surahNumber: true })}
      </View>
    </View>
  );
}
