import { createContext, ReactNode, useContext, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { ApiVoteObject, VoteListingQuery } from "@/types/types.ts";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CONSTANTS, QueryKey } from "@/constants.ts";
import { constructUrlSearchParams, getNextPageParam } from "@/utils/helpers.ts";

// Define the context type
interface MyVotesContextType {
  myVotes: ApiVoteObject[] | null;
  isLoading: boolean;
  isFetchingNextPage: boolean;
}

export const MyVotesContext = createContext<MyVotesContextType | null>(null);

export const MyVotesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const account = useCurrentAccount();
  const params: VoteListingQuery = {
    voter: account?.address,
  };

  const {
    data: myVotes,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    initialPageParam: null,
    queryKey: [QueryKey.Vote, params, ""],
    queryFn: async ({ pageParam }) => {
      const data = await fetch(
        CONSTANTS.apiEndpoint +
          "votes" +
          constructUrlSearchParams({
            ...params,
            ...(pageParam ? { cursor: pageParam as string } : {}),
          }),
      );
      return data.json();
    },
    select: (data): ApiVoteObject[] => data.pages.flatMap((page) => page.data),
    getNextPageParam,
  });
  useEffect(() => {
    if (!isLoading && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isLoading, isFetchingNextPage]);

  return (
    <MyVotesContext.Provider
      value={{
        myVotes: myVotes ?? null,
        isLoading,
        isFetchingNextPage,
      }}
    >
      {children}
    </MyVotesContext.Provider>
  );
};

export function useMyVotesContext() {
  const myVotesContext = useContext(MyVotesContext);
  if (!myVotesContext) {
    throw new Error("MyVotesContext must be used within the context");
  }
  return myVotesContext;
}
