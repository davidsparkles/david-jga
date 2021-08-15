import React from "react";
import { Data } from "../../api/useData";
import "./GameHeader.css";

export default function GameHeader(props: { data?: Data }): JSX.Element {
  return (
    <div className="gameHeader">
      <div className="gameHeaderTitle">Quest Master</div>
      <div className="gameHeaderLevel">
        Level {props.data?.currentLevel ?? 1} / {props.data?.maxLevel ?? "?"}
      </div>
      <Progress current={props.data?.xpWithinCurrentLevel ?? 0} max={(props.data?.xpToNextLevel ?? 0) + (props.data?.xpWithinCurrentLevel ?? 1)} />
    </div>
  );
}

function Progress(props: { max: number; current: number }): JSX.Element {
  const ratio = 100 * props.current / props.max;

  return (
    <div className="gameProgressContainer">
      <div className="gameProgressBar">
        <div style={{ width: `${ratio}%` }} className="gameProgressCurrent">
          <div className="gameProgressCurrentText">
            {props.current}
          </div>
        </div>
      </div>
      {props.max}↑
    </div>
  )
}
