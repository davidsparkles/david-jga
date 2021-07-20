import React, { useState } from "react";
import { Quest } from "../api/useData";
import { Permission } from "../permission";
import QuestDetails from "./QuestDetails";
import "./Quests.css";

export default function Quests(props: { quests: Quest[]; permission: Permission; refetch: () => void }): JSX.Element {
  const [filterList, setFilterList] = useState<boolean>(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  if (selectedQuest != null) {
    return <QuestDetails quest={selectedQuest} onBack={() => { setSelectedQuest(null); props.refetch() }} permission={props.permission} />;
  }

  return (
    <div className="questList">
      <div className="questFilter">
        <input type="checkbox" checked={filterList} onChange={(evt) => setFilterList(evt.target.checked)} />Erledigte Quests verbergen
      </div>
      {props.quests
        .filter(({ state }) => filterList === true ? state !== "closed" : true)
        .map((quest, index) => (
          <div key={index} className={`questBox ${quest.state}`} onClick={() => quest.state !== "hidden" && setSelectedQuest(quest)}>
            <div className="questHeader">
              <div className="questTitle">{(props.permission === "none" && quest.state === "hidden") || quest.title == null ? "🔒 ???" : quest.title}</div>
              <div className="questPoints">
                {
                  quest.state !== "closed" ? quest.maxXp : `${quest.reachedXp} / ${quest.maxXp}`
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
  );
}

function formatDescription(description?: string): string {
  if (description == null) return "???";
  if (description.length < 100) return description;
  return description.substring(0, 96) + " ...";
}
