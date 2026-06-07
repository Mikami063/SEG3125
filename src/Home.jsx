import { Link } from 'react-router-dom';
import heroImg from "./assets/moinzon-mountains-1412683.svg";
import FloatingPortfolio from "./FloatingPortfolio";

function Home() {
  return (
    <div
      className="app-background"
      style={{
        backgroundImage: `url(${heroImg})`,
      }}
    >
      <h1>Welcome to the Home Page</h1>
      <FloatingPortfolio />
    </div>
  );
}

export default Home;
