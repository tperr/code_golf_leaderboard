import axios from "axios";
import golfers from "../golfers";
import { langs, problems } from "../problems";

export type Solution = {
  bytes: number;
  chars: number;
  golfer: string;
  hole: string;
  lang: string;
  scoring: string;
  submitted: string;
};

export interface LeaderboardProps {
  hole: string;
  language: string;
}

export type LeaderboardEntry = {
  golfer: string;
  chars: number;
};

export type ScoredSolution = Solution & {
  points: number;
};

export type AggregateLeaderboardEntry = Omit<LeaderboardEntry, "chars"> & {
  points: number;
};

export function fetchLeaderboardEntries(
  hole: string,
  lang: string
): Promise<Solution[]> {
  return axios
    .get(`https://code.golf/api/solutions-log?hole=${hole}&lang=${lang}`)
    .then((res) => res.data)
    .then((data: Solution[]) => {
      const solns: Map<string, Solution> = new Map();
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
    .then((map) => Array.from(map.values()))
    .then((arr) => arr.sort((a, b) => a.chars - b.chars));
}

const baseScore = 8;

export function fetchAggregateLeaderboardEntries(): Promise<ScoredSolution[]> {
  return Promise.all(
    langs
      .map((lang) =>
        problems.map((hole) => fetchLeaderboardEntries(hole, lang))
      )
      .flat()
  ).then((data) =>
    data
      .map((arr) =>
        arr.slice(0, 3).map((val, idx): ScoredSolution => {
          return {
            ...val,
            points: baseScore / Math.pow(2, idx),
          };
        })
      )
      .flat()
  );
}
