// App.jsx
import React from "react";
import Game from "./game"; // Assuming game.jsx is in the same folder as App.jsx

function App() {
  return (
    <div className="App">
      <Game /> {/* This will render the game directly */}
    </div>
  );
}

export default App;
