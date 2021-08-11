import React from "react";
import { Link, RouteChildrenProps } from "react-router-dom";
import { AiFillTrophy, AiFillSetting } from "react-icons/ai"
import { FaTasks } from "react-icons/fa"
import { RiFilePaper2Fill } from "react-icons/ri"
import { useAppSelector } from "../model/hooks";
import { selectPermission } from "../model/permissionReducer";
import "./GameFooter.css";

export default function GameFooter(props: RouteChildrenProps): JSX.Element {
  const permission = useAppSelector(selectPermission);

  return (
    <div className="gameFooter" style={permission === "edit" ? { gridTemplateColumns: "auto auto auto auto" } : undefined }>
      <Link to={{ pathname: "/quests", search: props.location.search }}>
        <FaTasks />
      </Link>
      <Link to={{ pathname: "/rewards", search: props.location.search }}>
        <AiFillTrophy />
      </Link>
      {
        permission === "edit" && (
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
