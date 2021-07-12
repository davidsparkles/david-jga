import React from "react";
import "./Header.css";

export default function Header(props: { gameId: string }): JSX.Element {
  return <div className="header">{props.gameId}</div>
}