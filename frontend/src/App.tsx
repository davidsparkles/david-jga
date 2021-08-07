import Cookies from "js-cookie";
import React, { useState } from "react";
import "./App.css";
import Game from "./components/Game";
import { Permission } from "./permission";

export default function App() {
  const [permission] = useState<Permission>(getPermission());

  return (
    <div className="app" onTouchMove={(evt) => console.log(evt)}>
      <Game permission={permission} />
    </div>
  );
}

function getPermission(): Permission {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token") ?? Cookies.get("token");
  if (token != null) Cookies.set("token", token, { sameSite: "lax", expires: 30 });
  if (token === "fitti") return "view";
  if (token === "broiler") return "edit";
  return "none";
}
