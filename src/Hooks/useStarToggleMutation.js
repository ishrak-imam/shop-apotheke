import { useMutation, useQueryClient } from "react-query";

const starToggle = (repo) =>
    Promise.resolve({
        ...repo,
        isStarted: !repo.isStared,
    });

export const useStarToggleMutation = (queryKey) => {
    const queryClient = useQueryClient();
    return useMutation(starToggle, {
        onMutate: (repo) => {
            queryClient.cancelQueries(queryKey);
            queryClient.setQueryData(queryKey, (oldData) => ({
                ...oldData,
                pages: oldData.pages.map((item) => {
                    if (item.page === repo.page) {
                        if (repo.isStared) {
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
                                        ...repo,
                                        isStared: !repo.isStared,
                                    },
                                },
                            },
                        };
                    }
                    return item;
                }),
            }));
        },
    });
};
