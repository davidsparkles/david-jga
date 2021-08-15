import React from "react";
import "./styles.scss";

interface NoDataProps {
  text?: string;
}

export default function NoData(props: NoDataProps): JSX.Element {
  return (
    <div className="no-data">
      {props.text ?? "Keine Daten gefunden"}
    </div>
  )
}
