import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { rowDirection } from "../../helpers/flexDirection";

interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: IPaginationProps) => {
  const pageLimit = 6;

  const startPage = Math.max(1, currentPage - Math.floor(pageLimit / 2));
  const endPage = Math.min(totalPages, startPage + pageLimit - 1);

  const pageRange =
    endPage >= startPage
      ? [...Array(endPage - startPage + 1).keys()].map((i) => startPage + i)
      : [];

  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <View style={styles.paginationContainer}>
      {pageRange.map((page) => (
        <PaginationButton
          key={page}
          text={page.toString()}
          onPress={() => handlePageChange(page)}
          isActive={currentPage === page}
        />
      ))}
    </View>
  );
};

const PaginationButton = ({ text, onPress, isActive }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.pageButton,
        isActive ? styles.activePageButton : styles.inactivePageButton,
      ]}
    >
      <Text
        style={[
          styles.pageText,
          isActive ? styles.activePageText : styles.inactivePageText,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: rowDirection(),
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 10,
    paddingBottom: 15,
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 2,
    borderRadius: 5,
  },
  activePageButton: {
    backgroundColor: "#22c55e",
  },
  inactivePageButton: {
    backgroundColor: "#f0f0f0",
  },
  pageText: {
    fontSize: 16,
  },
  activePageText: {
    color: "#fff",
    fontWeight: 600,
  },
  inactivePageText: {
    color: "#000",
    fontWeight: 600,
  },
});

export default Pagination;
