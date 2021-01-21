import { useMutation, queryCache } from "react-query";

const starToggle = ({ queryKey, repo }) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            queryCache.cancelQueries(queryKey);
            queryCache.setQueryData(queryKey, (oldData) =>
                oldData.map((item) => {
                    if (item.page === repo.page) {
                        const isStared = item.repos.byId[repo.id].isStared;

                        if (isStared) {
                            item.repos.starIds = item.repos.starIds.filter(
                                (id) => id !== repo.id
                            );
                        } else {
                            item.repos.starIds.push(repo.id);
                        }

                        return {
                            ...item,
                            repos: {
                                ...item.repos,
                                byId: {
                                    ...item.repos.byId,
                                    [repo.id]: {
                                        ...item.repos.byId[repo.id],
                                        isStared: !isStared,
                                    },
                                },
                            },
                        };
                    }
                    return item;
                })
            );
            resolve("ok");
        }, 0);
    });
};

export const useStarToggleMutation = () => useMutation(starToggle);
