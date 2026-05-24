import { useEffect, useState } from "react";
import "./FloatingPortfolio.css";

const items = [
  {
    id: "0",
    label: "a service site - Coming soon",
    content: "Coming soon",
    position: "top",
  },
  {
    id: "1",
    label: "un jeu de mémoire - Coming soon",
    content: "Coming soon",
    position: "right",
  },
  {
    id: "skills",
    label: "an e-commerce site - Coming soon",
    content: "Coming soon",
    position: "bottom",
  },
  {
    id: "contact",
    label: "an analytics site - Coming soon",
    content: "Coming soon",
    position: "left",
  },
];

const createOpenItemsState = (isOpen) =>
  items.reduce(
    (state, item) => ({
      ...state,
      [item.id]: isOpen,
    }),
    {}
  );

function FloatingPortfolio() {
  const [openItems, setOpenItems] = useState(() => createOpenItemsState(true));

  useEffect(() => {
    const foldTimer = setTimeout(() => {
      setOpenItems(createOpenItemsState(false));
    }, 1000);

    return () => clearTimeout(foldTimer);
  }, []);

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="portfolio-scene">
      <div className="center-card">
        <h2>Qingyun's Portfolio</h2>
        <hr/>
        <p>I'm studying Computer Engineering at University of Ottawa. I have a passion for software development and enjoy working on various projects.</p>
        <br/>
        <p>I'm currently taking a UI course to improve my design skills and principles.</p>
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
