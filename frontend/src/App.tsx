import React from "react";
import "./App.css";
import ChallengeEditor from "./components/ChallengeEditor";
import Game from "./components/Game";

function App() {
  return (
    <div className="App">
      <Game gameId={"1"} />
      <ChallengeEditor />
    </div>
  );
}

export default App;
