import React from "react";
import { RouteChildrenProps } from "react-router-dom";
import Challenges from "./Challenges";
import Header from "./Header";

export default function Game(props: RouteChildrenProps<{ gameId: string }>): JSX.Element {
  const gameId = props.match?.params.gameId;

  if (gameId == null) return <>GameId Not Found</>;

  return (
    <div className="Game">
        <Header gameId={gameId} />
        <Challenges />
    </div>
  );
}
