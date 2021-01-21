import React from "react";

import { List, Box, Button } from "@material-ui/core";
import { RepoItem } from "./RepoItem";
import { Filter } from "./Filter";
import { useGithubRepositories } from "../../Hooks/useGithubRepositories";
import { useStarToggleMutation } from "../../Hooks/useStarToggleMutation";

const date = new Date();
date.setDate(date.getDate() - 7);
const queryDate = date.toISOString().substr(0, 10);

export const RepositoryList: React.FC = () => {
    const [filter, setFilter] = React.useState("js");
    const onChangeFilter = (value) => {
        setFilter(value);
    };

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        queryKey,
    } = useGithubRepositories(`created:>${queryDate}+language:${filter}`);

    const { mutate: toggleStar } = useStarToggleMutation(queryKey);
    const onToggleStar = (repo) => {
        toggleStar(repo);
    };

    const [showStared, setShowStared] = React.useState(false);
    const onShowStared = () => {
        setShowStared(!showStared);
    };

    const repoIds = showStared ? data.starIds : data.ids;

    return (
        <Box maxWidth={650}>
            <Box
                display="flex"
                mb={4}
                justifyContent="space-between"
                width={650}
            >
                <Button
                    data-testid="star-filter"
                    variant="contained"
                    color="primary"
                    onClick={() => onShowStared()}
                >
                    {showStared ? "Show all" : "Show stared"}
                </Button>
                <Filter selected={filter} onChange={onChangeFilter} />
            </Box>

            <Box>
                {isLoading ? (
                    <Box mt={10} display="flex" justifyContent="center">
                        Loading...
                    </Box>
                ) : (
                    <List data-testid="repo-list">
                        {repoIds.map((id) => {
                            const repo = data.byId[id];
                            return (
                                <RepoItem
                                    key={repo.id}
                                    repo={repo}
                                    toggleStar={onToggleStar}
                                />
                            );
                        })}
                    </List>
                )}

                {hasNextPage && !showStared ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        {isFetchingNextPage ? (
                            "Loading..."
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    fetchNextPage();
                                }}
                            >
                                Load more
                            </Button>
                        )}
                    </Box>
                ) : null}
            </Box>
        </Box>
    );
};
