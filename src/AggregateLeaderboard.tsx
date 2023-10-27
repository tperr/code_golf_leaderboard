import { useQuery } from "@tanstack/react-query";
import { langs, problems } from "./problems";
import { Text } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import Table from "./Table";
import {
  fetchAggregateLeaderboardEntries,
  type AggregateLeaderboardEntry,
  type ScoredSolution,
} from "./util/leaderboard";
import { useMemo } from "react";

const columnHelper = createColumnHelper<AggregateLeaderboardEntry>();

const columns = [
  columnHelper.accessor("golfer", {
    cell: (info) => info.getValue(),
    header: "Golfer",
  }),
  columnHelper.accessor("points", {
    cell: (info) => info.getValue(),
    header: "Points",
    meta: {
      isNumeric: true,
    },
  }),
];

function filterBestOverall(
  data: ScoredSolution[]
): AggregateLeaderboardEntry[] {
  const filter_map: Map<
    string,
    Map<string, AggregateLeaderboardEntry>
  > = new Map();

  for (const entry of data) {
    let problem_map = filter_map.get(entry.golfer);
    if (!problem_map) {
      problem_map = new Map();
      filter_map.set(entry.golfer, problem_map);
    }

    const cur_entry = problem_map.get(entry.hole);
    if (!cur_entry || entry.points > cur_entry.points) {
      problem_map.set(entry.hole, entry);
    }
  }
  const user_scores: AggregateLeaderboardEntry[] = [];
  for (const [golfer, problem_map] of filter_map) {
    let points = 0;
    for (const entry of problem_map.values()) {
      points += entry.points;
    }
    user_scores.push({ golfer, points });
  }
  user_scores.sort((a, b) => b.points - a.points);
  return user_scores;
}

type AggregateLeaderboardProps = { hole: string; lang: string };

function AggregateLeaderboard({ hole, lang }: AggregateLeaderboardProps) {
  const { isPending, data, isSuccess } = useQuery({
    queryKey: [problems, langs],
    queryFn: fetchAggregateLeaderboardEntries,
  });

  const filteredData = useMemo(() => {
    if (isPending || !isSuccess) return undefined;
    if (hole === "all" && lang === "all") {
      return filterBestOverall(data);
    } else if (hole === "all") {
      return filterBestOverall(data.filter((entry) => entry.lang === lang));
    }
  }, [data, hole, isPending, isSuccess, lang]);

  if (isPending) {
    return <Text>Loading...</Text>;
  }

  if (!isSuccess || !filteredData) {
    return <Text>Error!</Text>;
  }

  return <Table columns={columns} data={filteredData} />;
}

export default AggregateLeaderboard;
