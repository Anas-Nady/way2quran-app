export const BASE_END_POINT = "https://way2quran.com/api";

interface IGetReciters {
  recitationSlug?: string;
  isTopReciter?: string;
  search?: string;
  currentPage?: number;
  sortBy?: string;
  pageSize?: number;
}

interface IGetReciter {
  reciterSlug: string;
}

interface ICreateMessage {
  senderName: string;
  senderEmail: string;
  content: string;
}

interface ISearchItems {
  query: string;
}

interface IIncrementDownloadCount {
  slug: string;
}

export async function getReciters({
  recitationSlug = "",
  isTopReciter = "",
  search = "",
  currentPage = 1,
  sortBy = "arabicName",
  pageSize = 50,
}: IGetReciters) {
  const res = await fetch(
    `${BASE_END_POINT}/reciters?recitationSlug=${recitationSlug}&isTopReciter=${isTopReciter}&search=${search}&currentPage=${currentPage}&sort=${sortBy}&pageSize=${pageSize}`
  );

  return res;
}

export async function getReciter({ reciterSlug }: IGetReciter) {
  const res = await fetch(
    `${BASE_END_POINT}/reciters/reciter-profile/${reciterSlug}?increaseViews=true`
  );

  return res;
}

export const createMessage = async ({
  senderName,
  senderEmail,
  content,
}: ICreateMessage) => {
  const res = await fetch(`${BASE_END_POINT}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ senderName, senderEmail, content }),
  });

  return res;
};

export const searchItems = async ({ query }: ISearchItems) => {
  const res = await fetch(
    `${BASE_END_POINT}/search?q=${encodeURIComponent(query)}`
  );

  return res;
};

export const incrementDownloadCount = async ({
  slug,
}: IIncrementDownloadCount) => {
  const res = await fetch(`${BASE_END_POINT}/mushaf/increment/${slug}`, {
    method: "POST",
  });

  return res;
};

export const getSurah = async (surahSlug: string) => {
  const res = await fetch(
    `${BASE_END_POINT}/surah/${surahSlug}?selectField=verses`
  );
  return res;
};

export const getMushafs = async () => {
  const res = await fetch(`${BASE_END_POINT}/mushaf`);
  return res;
};
