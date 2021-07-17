import React from "react";
import { Quest } from "../api/useData";
import "./Quests.css";

export default function Quests(props: { quests: Quest[] }): JSX.Element {
  return (
    <div className="questList">
      {props.quests.map((quest, index) => (
        <div key={index} className={`questBox ${quest.state}`}>
          <div className="questHeader">
            <div className="questTitle">{quest.title ?? "???"}</div>
            <div className="questPoints">
              {
                quest.state === "hidden" ? quest.maxPoints : `${quest.reachedPoints} / ${quest.maxPoints}`
              }
            </div>
          </div>
          {
            quest.state !== "hidden" && <div className="questDescription">{formatDescription(quest.description ?? "???")}</div>
          }
          {
            quest.state === "hidden" && <div className="questDescription">Mindestens {quest.minLevel} abgeschlossene Quests</div>
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
