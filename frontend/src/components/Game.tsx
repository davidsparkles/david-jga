import React, { useState } from "react";
import { useData } from "../api/useData";
import Quests from "./Quests";
import GameHeader from "./GameHeader";
import { Permission } from "../permission";
import Levels from "./Levels";
import "./Game.css";

type View = "quests" | "levels";

export default function Game(props: { permission: Permission }): JSX.Element {
  const { data, error, loading, refetch } = useData();
  const [view, setView] = useState<View>("quests");

  return (
    <div className="Game">
      <GameHeader data={data} />
      {loading && <>Laden ...</>}
      {error && <>{typeof error === "string" ? error : JSON.stringify(error)}</>}
      {data && (
          <>
            {props.permission === "edit" && (
              <div className="upperMenu">
                <button onClick={() => {
                  if (view === "quests") setView("levels");
                  else setView("quests");
                }}>{view === "quests" ? "Level anzeigen" : "Quests anzeigen"}</button>
              </div>
            )}
            {view === "quests" && (<Quests quests={data.quests} permission={props.permission} refetch={refetch} />)}
            {view === "levels" && (<Levels levels={data.levels} />)}
          </>
        )
      }
    </div>
  );
}
