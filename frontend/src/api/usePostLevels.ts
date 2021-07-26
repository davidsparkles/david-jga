import { useCallback, useState } from "react";
import { Level } from "./useData";

export function usePostLevels() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);

  const post = useCallback(async (levels: Level[]) => {
    try {
      setLoading(true);
      await fetch(`${window.location.hostname === "localhost" ? "http://localhost:3000" : ""}/api/levels`, {
        method: "POST",
        mode: "no-cors",
        cache: 'no-cache',
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(levels)
      })
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading]);

  return { loading, error, post };
}
