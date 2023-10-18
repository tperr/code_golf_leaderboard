import { Center, HStack, Heading, Select, VStack } from "@chakra-ui/react";
import { ChangeEvent, useCallback, useState } from "react";
import Leaderboard from "./Leaderboard";

function App() {
  const [problem, setProblem] = useState("fibonacci");
  const [language, setLanguage] = useState("python");

  const onProblemChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setProblem(e.target.value);
    },
    [setProblem]
  );
  const onLanguageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  }, []);

  return (
    <Center>
      <VStack>
        <Heading>Monster Mini Code Golf Leaderboard</Heading>
        <HStack>
          <Select value={problem} onChange={onProblemChange}>
            <option value="fibonacci">Fibonacci</option>
          </Select>
          <Select value={language} onChange={onLanguageChange}>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </Select>
        </HStack>
        <Leaderboard hole={problem} language={language} />
      </VStack>
    </Center>
  );
}

export default App;
