import React from "react";
import { RouteChildrenProps } from "react-router-dom";
import { useData } from "../api/useData";
import Challenges from "./Challenges";
import GameHeader from "./GameHeader";

export default function Game(props: RouteChildrenProps<{ gameId: string }>): JSX.Element {
  const gameId = props.match?.params.gameId;
  const { data, error } = useData(gameId);

  if (error) return <>Error: {error}</>;
  if (data == null) return <>No Data Found</>;

  return (
    <div className="Game">
        <GameHeader data={data} />
        <Challenges challenges={data.challenges} />
    </div>
  );
}
