import axios from "axios";
import golfers from "../golfers";

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
