import { useCallback, useEffect, useState } from "react";

export type questState = "open" | "closed" | "hidden";

export interface Quest {
  id: string;
  title?: string;
  description?: string;
  maxXp: number;
  reachedXp: number;
  minLevel: number;
  state: questState;
}

export interface Data {
  gameId: number;
  gameTitle: string;
  maxLevel: number;
  currentLevel: number;
  currentXp: number;
  xpWithinCurrentLevel: number;
  xpToNextLevel: number;
  quests: Quest[];
}

async function getData(gameId: string): Promise<Data> {
  const res = await fetch(`${window.location.hostname === "localhost" ? "http://localhost:3000" : ""}/api/game/${gameId}`);
  if (res.status === 200) return res.json();
  console.error(`Fetch error: ${res.status} ${res.statusText} ${res.text()}`);
  throw new Error(res.statusText);
}

export function useData(gameId?: string): { data?: Data; error?: any; refetch: () => void } {
  const [data, setData] = useState<Data | undefined>(undefined);
  const [error, setError] = useState<any | undefined>(undefined);

  const refetch = useCallback(() => {
    console.log("fetch");
    if (gameId == null) {
      setData(undefined);
      setError(new Error("GameId Not Given"));
    } else {
      (async () => {
        try {
          setData(await getData(gameId));
          setError(undefined);
        } catch (err) {
          console.log(err);
          setData(undefined);
          setError("some error");
        }
      })();
    }
  }, [gameId]);

  useEffect(refetch, [refetch]);

  return { data, error, refetch };
}
