import { Center, HStack, Heading, Select, VStack } from "@chakra-ui/react";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import Leaderboard from "./Leaderboard";
import { bonus_problems, langs, problems } from "./problems";
import AggregateLeaderboard from "./AggregateLeaderboard";

function App() {
  const [problem, setProblem] = useState("all");
  const [language, setLanguage] = useState("all");

  const onProblemChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setProblem(e.target.value);
    },
    [setProblem]
  );
  const onLanguageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setLanguage(e.target.value);
    },
    [setLanguage]
  );

  const problemOptions = useMemo(
    () =>
      ["all", ...problems, ...bonus_problems].map((val) => {
        const name = val
          .split("-")
          .map((val) => val.charAt(0).toUpperCase() + val.substring(1))
          .join(" ");

        return (
          <option key={val} value={val}>
            {name}
          </option>
        );
      }),
    []
  );
  const langOptions = useMemo(
    () =>
      ["all", ...langs].map((val) => {
        // Make sentence case
        const name = val.charAt(0).toUpperCase() + val.substring(1);

        return (
          <option key={val} value={val}>
            {name}
          </option>
        );
      }),
    []
  );

  const leaderboard = useMemo(() => {
    if (problem === "all" || language === "all") {
      return <AggregateLeaderboard hole={problem} lang={language} />;
    } else {
      return <Leaderboard hole={problem} language={language} />;
    }
  }, [language, problem]);

  return (
    <Center>
      <VStack>
        <Heading>Monster Mini Code Golf Leaderboard 2.0</Heading>
        <HStack>
          <Select value={problem} onChange={onProblemChange}>
            {problemOptions}
          </Select>
          <Select value={language} onChange={onLanguageChange}>
            {langOptions}
          </Select>
        </HStack>
        {leaderboard}
      </VStack>
    </Center>
  );
}

export default App;
