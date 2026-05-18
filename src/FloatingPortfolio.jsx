import { useState } from "react";
import "./FloatingPortfolio.css";

const items = [
  {
    id: "about",
    label: "About",
    content: "About me text here.",
    position: "top",
  },
  {
    id: "projects",
    label: "Projects",
    content: "Projects content here.",
    position: "right",
  },
  {
    id: "skills",
    label: "Skills",
    content: "Skills content here.",
    position: "bottom",
  },
  {
    id: "contact",
    label: "Contact",
    content: "Contact content here.",
    position: "left",
  },
];

function FloatingPortfolio() {
  const [openItems, setOpenItems] = useState({
    about: false,
    projects: false,
    skills: false,
    contact: false,
  });

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="portfolio-scene">
      <div className="center-card">
        <h1>My Portfolio</h1>
        <p>Main center content.</p>
      </div>

      {items.map((item) => {
        const isOpen = openItems[item.id];

        return (
          <button
            key={item.id}
            className={`floating-item ${item.position} ${
              isOpen ? "active" : ""
            }`}
            onClick={() => toggleItem(item.id)}
          >
            {isOpen ? (
              <div className="floating-content">
                <h2>{item.label}</h2>
                <p>{item.content}</p>
              </div>
            ) : (
              item.label
            )}
          </button>
        );
      })}
    </div>
  );
}

export default FloatingPortfolio;