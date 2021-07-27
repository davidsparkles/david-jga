import React, { useState } from "react";
import { Quest } from "../api/useData";
import { usePostQuest } from "../api/usePostQuest";
import { Permission } from "../permission";
import QuestDetails from "./QuestDetails";
import "./Quests.css";

export default function Quests(props: { quests: Quest[]; permission: Permission; refetch: () => void }): JSX.Element {
  const [filterList, setFilterList] = useState<boolean>(false);
  const [filterArchivedList, setFilterArchivedList] = useState<boolean>(true);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const { loading, error, post } = usePostQuest();

  if (selectedQuest != null) {
    return <QuestDetails quest={selectedQuest} onBack={() => { setSelectedQuest(null); props.refetch() }} permission={props.permission} />;
  }

  return (
    <>
    <div className="questList">
      <div className="questFilter">
        <input type="checkbox" checked={filterList} onChange={(evt) => setFilterList(evt.target.checked)} />Erledigte Quests verbergen
      </div>
      <div className="questFilter">
        <input type="checkbox" checked={filterArchivedList} onChange={(evt) => setFilterArchivedList(evt.target.checked)} />Archivierte Quests verbergen
      </div>
      {props.quests
        .filter(({ state }) => filterList === true ? state !== "closed" : true)
        .filter(({ archived }) => filterArchivedList === true ? archived === false : true)
        .filter(({ archived, disabled }) => (archived === false && disabled === false) || props.permission === "edit")
        .map((quest, index) => (
          <div
            key={index}
            className={`questBox ${quest.state} ${quest.disabled ? "disabled" : ""} ${quest.archived ? "archived" : ""}`}
            onClick={() => !(props.permission === "none" && quest.state === "hidden") && setSelectedQuest(quest)}
          >
            <div className="questHeader">
              <div className="questTitle">{(props.permission === "none" && quest.state === "hidden") || quest.title == null ? "🔒 ???" : `${quest.state === "hidden" ? "🔒 " : ""}${quest.title}`}</div>
              <div className="questPoints">
                {
                  quest.state !== "closed" ? quest.maxXp : `${quest.xp} / ${quest.maxXp}`
                } XP
              </div>
            </div>
            {
              !(props.permission === "none" && quest.state === "hidden") && <div className="questDescription">{formatDescription(quest.description ?? "???")}</div>
            }
            {
              quest.state === "hidden" && <div className="questDescription">Ab Level {quest.minLevel}</div>
            }
          </div>
      ))}
    </div>
    <div className="createQuestContainer">
      <button onClick={async () => {
        await post({ title: "Neue Quest", description: "", maxXp: 1, disabled: true, minLevel: 20, archived: false });
        props.refetch();
      }}>
        Neue Quest
      </button>
    </div>
    {loading && "loading ..."}
    {error && <>Fehler: {JSON.stringify(error)}</>}
    </>
  );
}

function formatDescription(description?: string): string {
  if (description == null) return "???";
  if (description.length < 100) return description;
  return description.substring(0, 96) + " ...";
}
