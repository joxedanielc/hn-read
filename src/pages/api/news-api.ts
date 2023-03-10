import axios, { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { snippetNews, newsValues, PageView } from "src/utils";

export const baseUrl = "https://hn.algolia.com/api/v1/search_by_date?";

export const GetStories = (
  language: string,
  page: number,
  news: {
    newsFavorited: snippetNews[];
    newsFavoritedIds: Set<number> | undefined;
  },
  pageView: PageView,
  perPage: number
) => {
  const [response, setResponse] = useState<snippetNews[]>([]);
  const [numberPages, setNumberPages] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [error, setError] = useState<AxiosError>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatedNewsFavorited, setUpdatedNewsFavorited] =
    useState<snippetNews[]>();

  const updateNewsFavorite = (news: snippetNews[]) => {
    setUpdatedNewsFavorited(news);
  };

  const fetchData = async () => {
    await axios
      .get(`${baseUrl}query=${language}&page=${page}`)
      .then(function (response) {
        setResponse(newsValues(response.data.hits, news.newsFavoritedIds));
        setNumberPages(response.data.nbPages);
        setTotalRecords(response.data.nbHits);
        setIsLoading(false);
      })
      .catch(function (error) {
        setError(error);
      });
  };

  useEffect(() => {
    if (pageView === PageView.all) {
      fetchData();
    } else {
      if (news.newsFavorited !== null) {
        const maxPage = Math.ceil(news.newsFavorited.length / perPage);
        setNumberPages(maxPage);
        setTotalRecords(news.newsFavorited.length);
        setResponse(news.newsFavorited);
        setIsLoading(false);
      } else {
        setResponse([]);
      }
    }
  }, [language, page, pageView, updatedNewsFavorited]);
  return { response, numberPages, totalRecords, updateNewsFavorite, isLoading };
};
