import React, { useState } from "react";
import { useData } from "../api/useData";
import Quests from "./Quests";
import GameHeader from "./GameHeader";
import { Permission } from "../permission";
import Levels from "./Levels";

type View = "quests" | "levels";

export default function Game(props: { permission: Permission }): JSX.Element {
  const { data, error, refetch } = useData();
  const [view, setView] = useState<View>("quests");

  if (error) return <>Error: {JSON.stringify(error)}</>;
  if (data == null) return <>No Data Found</>;

  return (
    <div className="Game">
      <GameHeader data={data} />
      {props.permission === "edit" && (<button onClick={() => {
        if (view === "quests") setView("levels");
        else setView("quests");
      }}>{view === "quests" ? "Level anzeigen" : "Quests anzeigen"}</button>)}
      {view === "quests" && (<Quests quests={data.quests} permission={props.permission} refetch={refetch} />)}
      {view === "levels" && (<Levels levels={data.levels} />)}
    </div>
  );
}
