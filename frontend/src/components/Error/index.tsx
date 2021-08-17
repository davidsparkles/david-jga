import React from "react";

export default function Error(props: { error: any }): JSX.Element {
  return (
    <div className="error">
      Fehler: {typeof props.error === "object" ? JSON.stringify(props.error) : props.error}
    </div>
  );
}
