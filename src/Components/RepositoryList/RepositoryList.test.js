import { render, screen, fireEvent } from "@testing-library/react";
import { RepositoryList } from "./";

jest.mock("../../Hooks/useStarToggleMutation", () => ({
    useStarToggleMutation: () => [jest.fn()],
}));

jest.mock("../../Hooks/useGithubRepositories", () => ({
    useGithubRepositories: () => ({
        data: Array.from(Array(15).keys()).reduce(
            (map, id) => {
                map.ids.push(id);
                map.byId[id] = {
                    id,
                    isStared: false,
                    owner: {
                        id,
                        name: "name",
                        avatar: "avatar",
                        profile: "profile",
                    },
                    url: "url",
                    name: "repo_name",
                    language: "language",
                    stars: 42,
                    watchers: 42,
                    openIssues: 42,
                    description: "Description",
                    page: 1,
                };
                return map;
            },
            { ids: [], byId: {}, starIds: [] }
        ),
        isLoading: false,
    }),
}));

describe("Repository list", () => {
    it("should render a list of repositories", () => {
        render(<RepositoryList />);
        const repoList = screen.getByTestId("repo-list");
        expect(repoList.childElementCount).toEqual(15);

        const starFilterButton = screen.getByTestId("star-filter");
        fireEvent.click(starFilterButton);
        const filteredRepoList = screen.getByTestId("repo-list");
        expect(filteredRepoList.childElementCount).toEqual(0);
    });

    
});
