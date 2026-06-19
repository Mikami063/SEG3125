import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./GameSitePage.css";

const levels = {
  beginner: { label: "Beginner", count: 3, seconds: 8 },
  intermediate: { label: "Intermediate", count: 5, seconds: 6 },
  advanced: { label: "Advanced", count: 7, seconds: 4 },
};

const themes = {
  potions: {
    label: "Fantasy Potions",
    command: "brew --memory --arcane",
    recipeNoun: "Potion",
    items: [
      "Mooncap",
      "Dragon Scale",
      "Silverthorn",
      "Phoenix Ash",
      "Glowberry",
      "Frost Lily",
      "Witch Salt",
      "Starlight Dew",
      "Crystal Moss",
      "Ember Root",
    ],
  },
  lab: {
    label: "Science Lab",
    command: "run --sequence --compound",
    recipeNoun: "Formula",
    items: [
      "Copper Sulfate",
      "Sodium Drop",
      "Neon Gel",
      "Iodine Flask",
      "Zinc Powder",
      "Litmus Strip",
      "Carbon Chip",
      "Helium Cell",
      "Quartz Lens",
      "Acid Buffer",
    ],
  },
  cooking: {
    label: "Cooking Recipe",
    command: "cook --recall --timed",
    recipeNoun: "Recipe",
    items: [
      "Basil Leaf",
      "Honey Spoon",
      "Cocoa Dust",
      "Lemon Peel",
      "Sea Salt",
      "Chili Oil",
      "Vanilla Pod",
      "Rice Flour",
      "Mint Sprig",
      "Berry Jam",
    ],
  },
};

const modes = {
  relaxed: { label: "Relaxed Practice", rounds: null },
  challenge: { label: "Score Challenge", rounds: 5 },
};

function buildRound(levelKey, themeKey, roundNumber) {
  const level = levels[levelKey];
  const theme = themes[themeKey];
  const offset = (roundNumber * 2 + level.count) % theme.items.length;
  const orderedItems = [
    ...theme.items.slice(offset),
    ...theme.items.slice(0, offset),
  ];

  return {
    id: `${themeKey}-${levelKey}-${roundNumber}`,
    number: roundNumber + 1,
    recipe: orderedItems.slice(0, level.count),
    pool: [...orderedItems].sort((a, b) => a.localeCompare(b)),
  };
}

function GameSitePage() {
  const [levelKey, setLevelKey] = useState("beginner");
  const [themeKey, setThemeKey] = useState("potions");
  const [modeKey, setModeKey] = useState("relaxed");
  const [roundNumber, setRoundNumber] = useState(0);
  const [phase, setPhase] = useState("config");
  const [timeLeft, setTimeLeft] = useState(levels.beginner.seconds);
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const level = levels[levelKey];
  const theme = themes[themeKey];
  const mode = modes[modeKey];
  const round = useMemo(
    () => buildRound(levelKey, themeKey, roundNumber),
    [levelKey, themeKey, roundNumber],
  );
  const isFinished = phase === "ended";
  const maxRounds = mode.rounds;
  const currentRoundLabel = maxRounds
    ? `${Math.min(roundNumber + 1, maxRounds)} / ${maxRounds}`
    : `Practice ${roundNumber + 1}`;
  const isCompleteSelection = selected.length === round.recipe.length;

  useEffect(() => {
    if (phase !== "memorize") {
      return undefined;
    }

    if (timeLeft <= 0) {
      setPhase("recall");
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setTimeLeft((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [phase, timeLeft]);

  function startGame() {
    setRoundNumber(0);
    setScore(0);
    setFeedback(null);
    startRound(0);
  }

  function startRound(nextRoundNumber) {
    setRoundNumber(nextRoundNumber);
    setSelected([]);
    setFeedback(null);
    setTimeLeft(levels[levelKey].seconds);
    setPhase("memorize");
  }

  function toggleIngredient(item) {
    if (phase !== "recall") {
      return;
    }

    setSelected((current) => {
      if (current.includes(item)) {
        return current.filter((value) => value !== item);
      }

      if (current.length >= round.recipe.length) {
        return current;
      }

      return [...current, item];
    });
  }

  function moveSelected(index, direction) {
    setSelected((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function checkRecipe() {
    if (feedback?.correct) {
      return;
    }

    const correct =
      selected.length === round.recipe.length &&
      selected.every((item, index) => item === round.recipe[index]);

    setFeedback({
      correct,
      title: correct ? "MATCH CONFIRMED" : "SEQUENCE MISMATCH",
      detail: correct
        ? `${theme.recipeNoun} memory accepted.`
        : `Correct order: ${round.recipe.join(" > ")}`,
    });

    if (correct) {
      setScore((value) => value + 1);
    }
  }

  function nextRound() {
    const next = roundNumber + 1;
    if (maxRounds && next >= maxRounds) {
      setPhase("ended");
      return;
    }

    startRound(next);
  }

  function resetToConfig() {
    setPhase("config");
    setFeedback(null);
    setSelected([]);
    setRoundNumber(0);
    setScore(0);
  }

  return (
    <main className="game-shell min-vh-100 text-start">
      <nav className="navbar navbar-dark border-bottom border-success-subtle">
        <div className="container">
          <Link className="navbar-brand font-monospace fw-bold" to="/">
            Potion Recall
          </Link>
          <span className="badge text-bg-success font-monospace">
            {theme.command}
          </span>
        </div>
      </nav>

      <section className="container py-4 py-lg-5">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card terminal-card h-100">
              <div className="card-header font-monospace text-success">
                ./configure_session
              </div>
              <div className="card-body">
                <label className="form-label text-uppercase small" htmlFor="level">
                  Level
                </label>
                <select
                  className="form-select mb-3"
                  id="level"
                  value={levelKey}
                  disabled={phase !== "config"}
                  onChange={(event) => setLevelKey(event.target.value)}
                >
                  {Object.entries(levels).map(([key, option]) => (
                    <option key={key} value={key}>
                      {option.label}: {option.count} ingredients, {option.seconds}s
                    </option>
                  ))}
                </select>

                <label className="form-label text-uppercase small" htmlFor="theme">
                  Theme
                </label>
                <select
                  className="form-select mb-3"
                  id="theme"
                  value={themeKey}
                  disabled={phase !== "config"}
                  onChange={(event) => setThemeKey(event.target.value)}
                >
                  {Object.entries(themes).map(([key, option]) => (
                    <option key={key} value={key}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <label className="form-label text-uppercase small" htmlFor="mode">
                  Mode
                </label>
                <select
                  className="form-select mb-4"
                  id="mode"
                  value={modeKey}
                  disabled={phase !== "config"}
                  onChange={(event) => setModeKey(event.target.value)}
                >
                  {Object.entries(modes).map(([key, option]) => (
                    <option key={key} value={key}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-success font-monospace"
                    type="button"
                    onClick={startGame}
                  >
                    start --new-potion
                  </button>
                  {phase !== "config" && (
                    <button
                      className="btn btn-outline-success font-monospace"
                      type="button"
                      onClick={resetToConfig}
                    >
                      reset --config
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card terminal-card mb-4">
              <div className="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center">
                <span className="font-monospace text-success">
                  {theme.recipeNoun.toLowerCase()}_run.log
                </span>
                <span className="badge rounded-pill text-bg-dark border border-success">
                  Round {currentRoundLabel}
                </span>
              </div>
              <div className="card-body">
                {phase === "config" && (
                  <div className="terminal-empty text-center py-5">
                    <p className="display-6 mb-3">Potion Recall</p>
                    <p className="lead mb-0">
                      Configure a memory run, study the recipe, then rebuild the
                      exact ingredient order from the terminal pool.
                    </p>
                  </div>
                )}

                {phase === "memorize" && (
                  <>
                    <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-3">
                      <div>
                        <p className="text-uppercase small mb-1">Memorize phase</p>
                        <h1 className="h3 mb-0">{theme.recipeNoun} #{round.number}</h1>
                      </div>
                      <div className="text-end">
                        <span className="badge fs-6 text-bg-success font-monospace">
                          {timeLeft}s
                        </span>
                      </div>
                    </div>
                    <div className="progress mb-4" role="timer" aria-label="Recipe timer">
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${(timeLeft / level.seconds) * 100}%` }}
                      />
                    </div>
                    <ol className="recipe-list list-group list-group-numbered">
                      {round.recipe.map((item) => (
                        <li
                          className="list-group-item bg-transparent text-light border-success-subtle"
                          key={item}
                        >
                          {item}
                        </li>
                      ))}
                    </ol>
                  </>
                )}

                {phase === "recall" && (
                  <>
                    <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-4">
                      <div>
                        <p className="text-uppercase small mb-1">Recall phase</p>
                        <h1 className="h3 mb-0">Select and order ingredients</h1>
                      </div>
                      <span className="badge text-bg-dark border border-success">
                        Score {score}
                      </span>
                    </div>

                    <div className="row g-4">
                      <div className="col-md-6">
                        <h2 className="h5">Ingredient Pool</h2>
                        <div className="d-flex flex-wrap gap-2">
                          {round.pool.map((item) => {
                            const active = selected.includes(item);
                            return (
                              <button
                                className={`btn ${
                                  active ? "btn-success" : "btn-outline-success"
                                }`}
                                type="button"
                                key={item}
                                onClick={() => toggleIngredient(item)}
                              >
                                {item}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <h2 className="h5">Your Sequence</h2>
                        {selected.length === 0 ? (
                          <div className="terminal-empty rounded p-4">
                            No ingredients selected.
                          </div>
                        ) : (
                          <ol className="list-group list-group-numbered mb-3">
                            {selected.map((item, index) => (
                              <li
                                className="list-group-item selected-row d-flex justify-content-between align-items-center gap-2"
                                key={item}
                              >
                                <span>{item}</span>
                                <span className="btn-group btn-group-sm" role="group">
                                  <button
                                    className="btn btn-outline-light"
                                    type="button"
                                    aria-label={`Move ${item} earlier`}
                                    onClick={() => moveSelected(index, -1)}
                                  >
                                    up
                                  </button>
                                  <button
                                    className="btn btn-outline-light"
                                    type="button"
                                    aria-label={`Move ${item} later`}
                                    onClick={() => moveSelected(index, 1)}
                                  >
                                    down
                                  </button>
                                </span>
                              </li>
                            ))}
                          </ol>
                        )}

                        <button
                          className="btn btn-success w-100 font-monospace"
                          type="button"
                          disabled={!isCompleteSelection || feedback?.correct}
                          onClick={checkRecipe}
                        >
                          verify --sequence
                        </button>
                      </div>
                    </div>

                    {feedback && (
                      <div
                        className={`alert mt-4 mb-0 ${
                          feedback.correct ? "alert-success" : "alert-danger"
                        }`}
                        role="status"
                      >
                        <strong>{feedback.title}</strong>
                        <p className="mb-0">{feedback.detail}</p>
                        <button
                          className="btn btn-dark mt-3 font-monospace"
                          type="button"
                          onClick={nextRound}
                        >
                          {maxRounds && roundNumber + 1 >= maxRounds
                            ? "show --final-score"
                            : "next --potion"}
                        </button>
                      </div>
                    )}
                  </>
                )}

                {isFinished && (
                  <div className="terminal-empty text-center py-5">
                    <p className="display-6 mb-3">Run Complete</p>
                    <p className="lead mb-4">
                      Final score: {score} / {maxRounds}
                    </p>
                    <button
                      className="btn btn-success font-monospace"
                      type="button"
                      onClick={resetToConfig}
                    >
                      new --session
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-4">
                <div className="terminal-stat rounded p-3">
                  <span className="small text-uppercase">Memory</span>
                  <strong>Visual + Sequential</strong>
                </div>
              </div>
              <div className="col-md-4">
                <div className="terminal-stat rounded p-3">
                  <span className="small text-uppercase">Associations</span>
                  <strong>{theme.label}</strong>
                </div>
              </div>
              <div className="col-md-4">
                <div className="terminal-stat rounded p-3">
                  <span className="small text-uppercase">Difficulty</span>
                  <strong>{level.label}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default GameSitePage;
