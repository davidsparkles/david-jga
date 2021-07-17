import React from "react";
import "./App.css";
import QuestEditor from "./components/QuestEditor";
import Game from "./components/Game";

function App() {
  return (
    <div className="App">
      <Game gameId={"1"} />
      <QuestEditor />
    </div>
  );
}

export default App;
