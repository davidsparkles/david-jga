import React from "react";
import { Link, RouteChildrenProps } from "react-router-dom";
import { AiFillTrophy, AiFillSetting } from "react-icons/ai"
import { FaTasks } from "react-icons/fa"
import { RiFilePaper2Fill } from "react-icons/ri"
import "./GameFooter.css";
import { Permission } from "../permission";

export default function GameFooter(props: RouteChildrenProps & { permission: Permission }): JSX.Element {
  return (
    <div className="gameFooter" style={props.permission === "edit" ? { gridTemplateColumns: "auto auto auto auto" } : undefined }>
      <Link to={{ pathname: "/quests", search: props.location.search }}>
        <FaTasks />
      </Link>
      <Link to={{ pathname: "/rewards", search: props.location.search }}>
        <AiFillTrophy />
      </Link>
      {
        props.permission === "edit" && (
          <Link to={{ pathname: "/levels", search: props.location.search }}>
            <RiFilePaper2Fill />
          </Link>
        )
      }
      <Link to={{ pathname: "/settings", search: props.location.search }}>
        <AiFillSetting />
      </Link>
    </div>
  );
}
