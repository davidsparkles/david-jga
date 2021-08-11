import Cookies from "js-cookie";
import React, { useEffect } from "react";
import Game from "./components/Game";
import { useAppDispatch } from "./model/hooks";
import { changeToken } from "./model/permissionReducer";
import "./App.scss";

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = getPermissionTokenFromUrlOrCookie();
    if (token != null) dispatch(changeToken(token));
  }, [dispatch]);

  return (
    <div className="app" onTouchMove={(evt) => console.log(evt)}>
      <Game />
    </div>
  );
}

function getPermissionTokenFromUrlOrCookie(): string | undefined {
  try {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") ?? Cookies.get("token");
    return token ?? undefined;
  } catch (err) {
    console.warn("Error loading the permission token from url or cookie: ", JSON.stringify(err));
    return undefined;
  }
}
