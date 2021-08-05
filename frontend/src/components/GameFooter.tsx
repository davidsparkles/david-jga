import React from "react";
import { Link, RouteChildrenProps } from "react-router-dom";
import { AiFillTrophy } from "react-icons/ai"
import { FaTasks } from "react-icons/fa"
import { RiFilePaper2Fill } from "react-icons/ri"
import "./GameFooter.css";

export default function GameFooter(props: RouteChildrenProps): JSX.Element {
  return (
    <div className="gameFooter">
      <Link to={{ pathname: "/quests", search: props.location.search }}>
        <FaTasks />
      </Link>
      <Link to={{ pathname: "/rewards", search: props.location.search }}>
        <AiFillTrophy />
      </Link>
      <Link to={{ pathname: "/levels", search: props.location.search }}>
        <RiFilePaper2Fill />
      </Link>
    </div>
  );
}
