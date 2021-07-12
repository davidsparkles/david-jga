import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import Game from "./components/Game";
import Lobby from "./components/Lobby";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route path="/" exact component={Lobby} />
        <Route path="/game/:gameId" component={Game} />
      </BrowserRouter>
    </div>
  );
}

export default App;
