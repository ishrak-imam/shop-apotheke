import { renderHook } from "@testing-library/react-hooks";
import { useGithubRepositories } from "./useGithubRepositories";

import nock from "nock";

const fakeList = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    text: `test data ${i}`,
}));

describe("useGithubRepositories hook test", () => {
    it("Returns normalized data", async () => {
        nock("http://example.com")
            .get("/api/data")
            .reply(200, {
                data: {
                    total_count: fakeList.length,
                    items: fakeList,
                },
            });

        const { result, waitFor, unmount } = renderHook(() =>
            useGithubRepositories("query")
        );

        await waitFor(() => {
            return result.current.isSuccess;
        });

        const { data } = result.current;
        expect(data).toHaveProperty("ids");
        expect(data).toHaveProperty("byId");
        expect(data).toHaveProperty("starIds");

        unmount();
    });
});
