import axios from "axios";
import { useCallback, useState } from "react";
import { Heading, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Solution = {
  bytes: number;
  chars: number;
  golfer: string;
  hole: string;
  lang: string;
  scoring: string;
  submitted: string;
};

interface LeaderboardProps {
  hole: string;
  language: string;
}

type LeaderboardEntry = {
  golfer: string;
  chars: number;
  submitted: string;
};

const golfers = new Set([
  "msportstar97",
  "jrdallen97",
  "skagget77",
  "Nickmacd88",
]);

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

function fetchLeaderboardEntries(
  hole: string,
  lang: string
): Promise<LeaderboardEntry[]> {
  return axios
    .get(`https://code.golf/api/solutions-log?hole=${hole}&lang=${lang}`)
    .then((res) => res.data)
    .then((data: Solution[]) => {
      const solns: Map<string, LeaderboardEntry> = new Map();
      for (const entry of data) {
        if (!golfers.has(entry.golfer)) {
          continue;
        }
        const date_cur = new Date(entry.submitted).getTime();
        const date_next = new Date(entry.submitted).getTime();
        if (date_cur < date_next) {
          continue;
        }
        solns.set(entry.golfer, entry);
      }
      return solns;
    })
    .then((map) => Array.from(map.values()));
}

function LeaderboardQuery() {
    
}

function Leaderboard({ hole, language }: LeaderboardProps) {
  const solutionsQueryFn = useCallback((): Promise<LeaderboardEntry[]> => {
    return fetchLeaderboardEntries(hole, language);
  }, [hole, language]);
  const { isLoading, data, isSuccess } = useQuery({
    queryKey: [hole, language],
    queryFn: solutionsQueryFn,
  });

  const table = useReactTable({
    columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!isSuccess) {
    return <Text>Error!</Text>;
  }

  return <></>;
}

export default Leaderboard;
