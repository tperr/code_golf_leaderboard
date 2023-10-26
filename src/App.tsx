import { Center, HStack, Heading, Select, VStack } from "@chakra-ui/react";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import Leaderboard from "./Leaderboard";

const problems = ["fibonacci", "fizz-buzz"];
const langs = ["java", "python", "c", "cpp"];

function App() {
  const [problem, setProblem] = useState(problems[0]);
  const [language, setLanguage] = useState(langs[0]);

  const onProblemChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setProblem(e.target.value);
    },
    [setProblem]
  );
  const onLanguageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  }, []);

  const problemOptions = useMemo(
    () => problems.map((val) => <option value={val}>{val}</option>),
    []
  );
  const langOptions = useMemo(
    () =>
      langs.map((val) => {
        // Make sentence case
        const name = val.charAt(0).toUpperCase() + val.substring(1);

        return <option value={val}>{name}</option>;
      }),
    []
  );

  return (
    <Center>
      <VStack>
        <Heading>Monster Mini Code Golf Leaderboard</Heading>
        <HStack>
          <Select value={problem} onChange={onProblemChange}>
            {problemOptions}
          </Select>
          <Select value={language} onChange={onLanguageChange}>
            {langOptions}
          </Select>
        </HStack>
        <Leaderboard hole={problem} language={language} />
      </VStack>
    </Center>
  );
}

export default App;
