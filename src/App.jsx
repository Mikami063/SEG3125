import heroImg from "./assets/moinzon-mountains-1412683.svg";
import "./App.css";
import FloatingPortfolio from "./FloatingPortfolio";

function App() {
  return (
    <div
      className="app-background"
      style={{
        backgroundImage: `url(${heroImg})`,
      }}
    >
      <FloatingPortfolio />
    </div>
  );
}

export default App;
