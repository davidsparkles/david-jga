import React, { useState } from "react";
import "./App.css";
import Game from "./components/Game";
import { Permission } from "./permission";

export default function App() {
  const [permission] = useState<Permission>(getPermission());

  return (
    <div className="App" onTouchMove={(evt) => console.log(evt)}>
      <Game permission={permission} />
      {permission === "view" && <div className="role">Role: Viewer</div>}
      {permission === "edit" && <div className="role">Role: Editor</div>}
    </div>
  );
}

function getPermission(): Permission {
  const search = window.location.search;
  if (search.toLowerCase().includes("fitti")) return "view";
  if (search.toLowerCase().includes("broiler")) return "edit";
  return "none";
}
