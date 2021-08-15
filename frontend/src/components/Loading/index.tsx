import React, { useState, useEffect } from "react";
import "./styles.scss";

const MS = 1000;

export default function Loading(props: object): JSX.Element {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      setDots(dots.length >= 3 ? "" : dots + ".");
    }, MS);
    return () => clearTimeout(id);
  }, [dots, setDots]);

  return (
    <div className="loading-component">
      Laden {dots}
    </div>
  );
}
