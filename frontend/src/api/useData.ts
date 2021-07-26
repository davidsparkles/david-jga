import { useCallback, useEffect, useState } from "react";

export type questState = "open" | "closed" | "hidden";

export interface Quest {
  id: string;
  title: string;
  description: string;
  maxXp: number;
  xp: number | null;
  minLevel: number;
  disabled: boolean;
  state: questState;
}

export interface Level {
  id: number;
  requiredXp: number;
}

export interface Data {
  maxLevel: number;
  currentLevel: number;
  currentXp: number;
  xpWithinCurrentLevel: number;
  xpToNextLevel: number;
  quests: Quest[];
  levels: Level[];
}

async function getData(): Promise<Data> {
  const res = await fetch(`${window.location.hostname === "localhost" ? "http://localhost:3000" : ""}/api/data`);
  if (res.status === 200) return res.json();
  console.error(`Fetch error: ${res.status} ${res.statusText} ${res.text()}`);
  throw new Error(res.statusText);
}

export function useData(): { data?: Data; error?: any; refetch: () => void } {
  const [data, setData] = useState<Data | undefined>(undefined);
  const [error, setError] = useState<any | undefined>(undefined);

  const refetch = useCallback(() => {
    (async () => {
      try {
        setData(await getData());
        setError(undefined);
      } catch (err) {
        console.log(err);
        setData(undefined);
        setError("some error");
      }
    })();
  }, []);

  useEffect(refetch, [refetch]);

  return { data, error, refetch };
}
