import React from 'react';
import Main from "./components/main";
import "./css/main.css"

function App() {
  return (
    <div className="main-container">
      <Main component = {Main}/>
    </div>
  );
}

export default App;
