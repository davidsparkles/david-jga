import React from "react";
import { useData } from "../api/useData";
import Challenges from "./Challenges";
import GameHeader from "./GameHeader";

export default function Game(props: { gameId: string }): JSX.Element {
  const gameId = props.gameId;
  const { data, error } = useData(gameId);

  if (error) return <>Error: {JSON.stringify(error)}</>;
  if (data == null) return <>No Data Found</>;

  return (
    <div className="Game">
        <GameHeader data={data} />
        <Challenges challenges={data.challenges} />
    </div>
  );
}
