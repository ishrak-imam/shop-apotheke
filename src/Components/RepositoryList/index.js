import React from "react";

import { List, Box, Button } from "@material-ui/core";
import { RepoItem } from "./RepoItem";
import { Filter } from "./Filter";
import { useGithubRepositories } from "../../Hooks/useGithubRepositories";
import { useStarToggleMutation } from "../../Hooks/useStarMutation";

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
        canFetchMore,
        fetchMore,
        isFetchingMore,
        queryKey,
    } = useGithubRepositories(`created:>${queryDate}+language:${filter}`);

    const [toggleStar] = useStarToggleMutation();
    const onToggleStar = (repo) => {
        toggleStar({ queryKey, repo });
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
                    <List>
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

                {canFetchMore && !showStared ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        {isFetchingMore ? (
                            "Loading..."
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    fetchMore();
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
