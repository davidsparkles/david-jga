import React from "react";
import "./Challenges.css";

type ChallengeState = "open" | "closed" | "hidden";

interface Challenge {
  title: string;
  description: string;
  maxPoints: number;
  reachedPoints: number;
  state: ChallengeState;
}

const data: Challenge[] = [
  {
    title: "Challenge 1",
    description: "Lorem ipsum dolor senum.",
    maxPoints: 1,
    reachedPoints: 1,
    state: "closed",
  },
  {
    title: "Challenge 2",
    description: "Lorem ipsum dolor senum.",
    maxPoints: 1,
    reachedPoints: 0,
    state: "closed",
  },
  {
    title: "Challenge 3",
    description: "Lorem ipsum dolor senum.",
    maxPoints: 2,
    reachedPoints: 0,
    state: "open",
  },
  {
    title: "Challenge 4",
    description: "Lorem ipsum dolor senum.",
    maxPoints: 1,
    reachedPoints: 0,
    state: "closed",
  },
];

export default function Challenges(): JSX.Element {
  return (
    <div className="challengeList">
      {data.map((item) => (
        <div className={`challengeBox ${item.state}`}>
          <div className="challengeHeader">
            <div className="challengeTitle">{item.title}</div>
            <div className="challengePoints">
              {item.reachedPoints} / {item.maxPoints}
            </div>
          </div>
          <div className="challengeDescription">{item.description}</div>
        </div>
      ))}
    </div>
  );
}
