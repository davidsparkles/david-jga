import React from "react";
import { useData } from "../api/useData";
import Quests from "./Quests";
import GameHeader from "./GameHeader";
import { Permission } from "../permission";

export default function Game(props: { gameId: string; permission: Permission }): JSX.Element {
  const gameId = props.gameId;
  const { data, error, refetch } = useData(gameId);

  if (error) return <>Error: {JSON.stringify(error)}</>;
  if (data == null) return <>No Data Found</>;

  return (
    <div className="Game">
        <GameHeader data={data} />
        <Quests quests={data.quests} permission={props.permission} refetch={refetch} />
    </div>
  );
}
