import { useInfiniteQuery } from "react-query";
import axios from "axios";

const LIMIT = 5;

const toRepositoryEntity = (item) => ({
    id: item.id,
    isStared: false,
    owner: {
        id: item.owner.id,
        name: item.owner.login,
        avatar: item.owner.avatar_url,
        profile: item.owner.html_url,
    },
    url: item.html_url,
    name: item.name,
    language: item.language,
    stars: item.stargazers_count,
    watchers: item.watchers_count,
    openIssues: item.open_issues,
    description: item.description,
});

const fetchData = async ({ queryKey, pageParam = 1 }) => {
    const { data } = await axios.get(
        `https://api.github.com/search/repositories?q=${queryKey[1]}&sort=stars&order=desc&per_page=${LIMIT}&page=${pageParam}`
    );

    return {
        totalPage: Math.ceil(data.total_count / LIMIT),
        page: pageParam,
        totalCount: data.total_count,
        repos: data.items.reduce(
            (map, item) => {
                map.ids.push(item.id);
                map.byId[item.id] = {
                    ...toRepositoryEntity(item),
                    page: pageParam,
                };
                return map;
            },
            { ids: [], byId: {}, starIds: [] }
        ),
    };
};

export const useGithubRepositories = (query: string) => {
    const queryKey = ["GithubRepositories", query];
    const queryResult = useInfiniteQuery(queryKey, fetchData, {
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        getNextPageParam: (lastPage) => {
            if (!lastPage) {
                return 0;
            }

            return lastPage.page < lastPage.totalPage ? lastPage.page + 1 : 0;
        },
    });

    const flattenedData = queryResult.data
        ? queryResult.data.pages.reduce(
              (map, page) => {
                  if (!page) {
                      return { ids: [], byId: {}, starIds: [] };
                  }
                  return {
                      ids: [...map.ids, ...page.repos.ids],
                      byId: { ...map.byId, ...page.repos.byId },
                      starIds: [...map.starIds, ...page.repos.starIds],
                  };
              },
              { ids: [], byId: {}, starIds: [] }
          )
        : [];

    return {
        ...queryResult,
        data: flattenedData,
        queryKey,
    };
};
