import axios from "axios";

export const BASE_END_POINT = "https://way2quran.com/api";
const api = axios.create({
  baseURL: BASE_END_POINT,
});

export async function getReciters({
  recitationSlug = "",
  isTopReciter = "",
  search = "",
  currentPage = 1,
  sortBy = "arabicName",
  pageSize = 50,
}) {
  const res = await fetch(
    `${BASE_END_POINT}/reciters?recitationSlug=${recitationSlug}&isTopReciter=${isTopReciter}&search=${search}&currentPage=${currentPage}&sort=${sortBy}&pageSize=${pageSize}`
  );

  return res;
}

export async function getReciter(reciterSlug) {
  const res = await fetch(
    `${BASE_END_POINT}/reciters/reciter-profile/${reciterSlug}?increaseViews=true`
  );

  return res;
}

export async function globalSearch(value) {
  const res = await fetch(`${BASE_END_POINT}/search?q=${value}`);
  return res;
}

export const createMessage = async ({ senderName, senderEmail, content }) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const { data } = await api.post(
    "/messages",
    { senderName, senderEmail, content },
    config
  );

  return data;
};

export const searchItems = async (query) => {
  const res = await fetch(
    `${BASE_END_POINT}/search?q=${encodeURIComponent(query)}`
  );

  return res;
};
