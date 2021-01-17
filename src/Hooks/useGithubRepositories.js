import { useInfiniteQuery } from "react-query";
import axios from "axios";

const LIMIT = 5;

const toRepositoryEntity = (item, page) => ({
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
    page,
});

const fetchData = async (_: string, query: string, page = 1) => {
    const { data } = await axios.get(
        `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=${LIMIT}&page=${page}`
    );

    return {
        totalPage: Math.ceil(data.total_count / LIMIT),
        page,
        totalCount: data.total_count,
        repos: data.items.reduce(
            (map, item) => {
                map.ids.push(item.id);
                map.byId[item.id] = toRepositoryEntity(item, page);
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
        getFetchMore: (lastPage) => {
            if (!lastPage) {
                return 0;
            }

            return lastPage.page < lastPage.totalPage ? lastPage.page + 1 : 0;
        },
    });

    const flattenedData = Array.isArray(queryResult.data)
        ? queryResult.data.reduce(
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
