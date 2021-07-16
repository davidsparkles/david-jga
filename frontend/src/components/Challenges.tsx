import React from "react";
import { Challenge } from "../api/useData";
import "./Challenges.css";

export default function Challenges(props: { challenges: Challenge[] }): JSX.Element {
  return (
    <div className="challengeList">
      {props.challenges.map((challenge) => (
        <div className={`challengeBox ${challenge.state}`}>
          <div className="challengeHeader">
            <div className="challengeTitle">{challenge.title ?? "???"}</div>
            <div className="challengePoints">
              {
                challenge.state === "hidden" ? challenge.maxPoints : `${challenge.reachedPoints} / ${challenge.maxPoints}`
              }
            </div>
          </div>
          <div className="challengeDescription">{challenge.description ?? "???"}</div>
        </div>
      ))}
    </div>
  );
}
