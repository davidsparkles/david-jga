import { useEffect, useState } from "react";

export type ChallengeState = "open" | "closed" | "hidden";

export interface Challenge {
  title: string;
  description: string;
  maxPoints: number;
  reachedPoints: number;
  state: ChallengeState;
}

export interface Data {
  gameId: string;
  gameTitle: string;
  totalReachedPoints: number;
  totalMaxPoints: number;
  challenges: Challenge[];
}

const challenges: Challenge[] = [
  {
    title: "Internatsquiz",
    description: "David tritt gegen Max an. Jeder darf sich noch einen zweiten Mann wählen. Es werden 9 Fragen gestellt. Das Team, dass zuerst auf den Buzzer haut, muss innerhalb von 5 Sekunden die richtige Antwort sagen. Falls diese falsch ist, hat das Gegnerteam noch 10 Sekunden um zu antworten. Wer mehr Punkte hat gewinnt.",
    maxPoints: 1,
    reachedPoints: 1,
    state: "closed",
  },
  {
    title: "Challenge 2",
    description: "Lorem ipsum dolor senum.",
    maxPoints: 1,
    reachedPoints: 0,
    state: "closed",
  },
  {
    title: "Challenge 3",
    description: "Lorem ipsum dolor senum.",
    maxPoints: 2,
    reachedPoints: 0,
    state: "open",
  },
  {
    title: "Challenge 4",
    description: "Lorem ipsum dolor senum.",
    maxPoints: 1,
    reachedPoints: 0,
    state: "closed",
  },
];

const data: Data = {
  gameId: "david-jga",
  gameTitle: "David JGA",
  totalReachedPoints: 12,
  totalMaxPoints: 50,
  challenges,
};

async function getData(gameId: string): Promise<Data> {
  return Promise.resolve(data);
}

export function useData(gameId?: string): { data?: Data; error?: any } {
  const [data, setData] = useState<Data | undefined>(undefined);
  const [error, setError] = useState<any | undefined>(undefined);

  useEffect(() => {
    if (gameId == null) {
      setData(undefined);
      setError(new Error("GameId Not Given"));
    } else {
      (async () => {
        try {
          setData(await getData(gameId));
          setError(undefined);
        } catch (err) {
          setData(undefined);
          setError(err);
        }
      })();
    }
  }, [gameId]);

  return { data, error };
}
