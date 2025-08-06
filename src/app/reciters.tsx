import React, { useContext, useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import recitations from "../constants/recitations";
import HeadingScreen from "../components/HeadingScreen";
import ReciterCard from "../components/Reciter/ReciterCard";
import LoadingSpinner from "../components/States/LoadingSpinner";
import GoBackButton from "../components/ui/GoBackButton";
import Pagination from "../components/ui/Pagination";
import NotFoundResults from "../components/States/NotFoundResults";
import { getReciters } from "../services/api";
import Error from "../components/States/Error";
import getRecitationType from "./../helpers/getRecitationType";
import getName from "../helpers/getName";
import { ScreenDimensionsContext } from "../contexts/ScreenDimensionsProvider";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Reciters() {
  const { screenWidth: width } = useContext(ScreenDimensionsContext);
  const { recitationSlug } = useLocalSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const [state, setState] = useState({
    reciters: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchReciters = async () => {
      setState({
        loading: true,
        error: null,
        reciters: [],
      });
      try {
        const res = await getReciters({
          recitationSlug: recitationSlug as string,
          currentPage,
          pageSize: 50,
        });
        const data = await res.json();

        if (!res.ok) {
          return (
            <Error
              message={data?.message || "An error occurred please try again"}
            />
          );
        }
        setTotalPages(data.pagination.pages);
        setState({ reciters: data.reciters, loading: false, error: null });
      } catch (error) {
        setState({ reciters: [], loading: false, error: error.message });
      }
    };

    fetchReciters();
  }, [recitationSlug, currentPage]);

  const recitation = recitations.find((rec) => rec.slug === recitationSlug);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderReciter = ({ item: reciter }) => (
    <ReciterCard
      key={reciter.slug}
      reciter={reciter}
      handleNavigateClick={() =>
        router.push({
          pathname: "/reciter",
          params: {
            reciterSlug: reciter.slug,
            recitationSlug: getRecitationType(recitationSlug as string),
          },
        })
      }
    />
  );

  const ListEmptyComponent = () => <NotFoundResults />;

  const ListHeaderComponent = () => (
    <View>
      <GoBackButton />
      <HeadingScreen headingTxt={getName(recitation)} />
    </View>
  );

  const ListFooterComponent = () =>
    totalPages > 1 && (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    );
  const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2;

  return (
    <View className="flex-1 w-full bg-gray-800">
      {state.loading ? (
        <LoadingSpinner />
      ) : state.error ? (
        <Error message={state.error} />
      ) : (
        <FlatList
          data={state.reciters}
          renderItem={renderReciter}
          keyExtractor={(item) => item.slug}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={ListEmptyComponent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            backgroundColor: "#1f2937", // bg-gray-800
          }}
          style={{ flex: 1 }}
          numColumns={numColumns}
          key={numColumns}
          columnWrapperStyle={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            flex: 1,
          }}
        />
      )}
    </View>
  );
}
