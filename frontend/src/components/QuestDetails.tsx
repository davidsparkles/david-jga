import React from "react";
import { Quest } from "../api/useData";
import { Permission } from "../permission";
import "./QuestDetails.css";

export default function QuestDetails(props: { quest: Quest; onBack: () => void; permission: Permission }): JSX.Element {
  return <div className="questDetails">
    <div className="backArrowContainer">
      <button className="backArrow" onClick={() => props.onBack()}>🠔 Zurück</button>
    </div>
    <div className="label">
      Titel
    </div>
    <div className="value">
      {props.quest.title ?? "-"}
    </div>
    <div className="label">
      Beschreibung
    </div>
    <div className="value">
      {props.quest.description ?? "-"}
    </div>
    <div className="label">
      Maximale XP
    </div>
    <div className="value">
      {props.quest.maxXp}
    </div>
    <div className="label">
      Erreichte XP
    </div>
    <div className="value">
      {props.quest.state !== "closed" ? "-" : props.quest.reachedXp}
    </div>
  </div>;
}