import React from "react";
import { VscLoading } from "react-icons/vsc";
import "./styles.scss";

export interface ButtonProps {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  children?: string | JSX.Element
}

export default function Button(props: ButtonProps): JSX.Element {
  const classes = ["qm-button"];
  if (props.disabled || props.loading) classes.push("qm-button-disabled");
  if (props.loading) classes.push("qm-button-loading");

  return (
    <button className={classes.join(" ")} onClick={props.disabled || props.loading ? undefined : props.onClick}>
      {props.children}{props.loading && <> <VscLoading className="qm-loading-icon" /></>}
    </button>
  );
}
