import React from "react";
import { Link } from "react-router-dom";

export default function Lobby(props: object): JSX.Element {
  return (
    <div className="Lobby">
        Create Game Now
        <br />
        <Link to="/game/david-jga">Go to David JGA</Link>
    </div>
  );
}
