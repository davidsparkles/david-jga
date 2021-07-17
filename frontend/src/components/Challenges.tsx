import React from "react";
import { Challenge } from "../api/useData";
import "./Challenges.css";

export default function Challenges(props: { challenges: Challenge[] }): JSX.Element {
  return (
    <div className="challengeList">
      {props.challenges.map((challenge, index) => (
        <div key={index} className={`challengeBox ${challenge.state}`}>
          <div className="challengeHeader">
            <div className="challengeTitle">{challenge.title ?? "???"}</div>
            <div className="challengePoints">
              {
                challenge.state === "hidden" ? challenge.maxPoints : `${challenge.reachedPoints} / ${challenge.maxPoints}`
              }
            </div>
          </div>
          {
            challenge.state !== "hidden" && <div className="challengeDescription">{formatDescription(challenge.description ?? "???")}</div>
          }
          {
            challenge.state === "hidden" && <div className="challengeDescription">Mindestens {challenge.minClosed} abgeschlossene Quests</div>
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
