import type { LeaderboardEntry, LeaderboardProps } from "./util/leaderboard";

import { useCallback } from "react";
import { Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import Table from "./Table";
import { fetchLeaderboardEntries } from "./util/leaderboard";

const columnHelper = createColumnHelper<LeaderboardEntry>();

const columns = [
  columnHelper.accessor("golfer", {
    cell: (info) => info.getValue(),
    header: "Golfer",
  }),
  columnHelper.accessor("chars", {
    cell: (info) => info.getValue(),
    header: "Characters",
    meta: {
      isNumeric: true,
    },
  }),
];

function Leaderboard({ hole, language }: LeaderboardProps) {
  const solutionsQueryFn = useCallback((): Promise<LeaderboardEntry[]> => {
    return fetchLeaderboardEntries(hole, language);
  }, [hole, language]);

  const { isPending, data, isSuccess } = useQuery({
    queryKey: [hole, language],
    queryFn: solutionsQueryFn,
  });

  if (isPending) {
    return <Text>Loading...</Text>;
  }

  if (!isSuccess) {
    return <Text>Error!</Text>;
  }

  return <Table columns={columns} data={data} />;
}

export default Leaderboard;
