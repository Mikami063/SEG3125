# Potion Recall Game Site

This folder contains the `/game` page for the Potion Recall memory game.

## Files

- `GameSitePage.jsx`: React game logic, configuration, and page layout.
- `GameSitePage.css`: Small scoped stylesheet for the terminal-style theme.

The route is connected in `src/App.jsx`:

```jsx
<Route path="/game" element={<GameSitePage />} />
```

## Game Configuration

The game data is stored at the top of `GameSitePage.jsx`.

### Levels

`levels` controls difficulty:

```jsx
const levels = {
  beginner: { label: "Beginner", count: 3, seconds: 8 },
  intermediate: { label: "Intermediate", count: 5, seconds: 6 },
  advanced: { label: "Advanced", count: 7, seconds: 4 },
};
```

Each level has:

- `label`: Text shown in the level dropdown.
- `count`: How many ingredients are included in the recipe.
- `seconds`: How long the recipe is visible before recall starts.

The current level is tracked by:

```jsx
const [levelKey, setLevelKey] = useState("beginner");
const level = levels[levelKey];
```

The level dropdown is generated from `Object.entries(levels)`, so adding a new level to `levels` automatically adds it to the UI.

### Themes

`themes` controls the ingredient set and wording:

```jsx
const themes = {
  potions: {
    label: "Fantasy Potions",
    command: "brew --memory --arcane",
    recipeNoun: "Potion",
    items: [
      { emoji: "🍄", name: "Mooncap" },
      { emoji: "🐉", name: "Dragon Scale" },
    ],
  },
};
```

Each theme has:

- `label`: Text shown in the theme dropdown.
- `command`: Terminal-style badge shown in the navbar.
- `recipeNoun`: Word used in feedback and recipe headings.
- `items`: Ingredient pool used to build each round.

Each item is an object:

- `emoji`: Icon shown to the left of the ingredient name.
- `name`: Text used for sorting, display, and answer comparison.

The current theme is tracked by:

```jsx
const [themeKey, setThemeKey] = useState("potions");
const theme = themes[themeKey];
```

The theme dropdown is generated from `Object.entries(themes)`, so adding a new theme to `themes` automatically adds it to the UI.

### Modes

`modes` controls session length:

```jsx
const modes = {
  relaxed: { label: "Relaxed Practice", rounds: null },
  challenge: { label: "Score Challenge", rounds: 5 },
};
```

- `rounds: null` means endless practice.
- `rounds: 5` means the game ends after 5 rounds.

The current mode is tracked by:

```jsx
const [modeKey, setModeKey] = useState("relaxed");
const mode = modes[modeKey];
const maxRounds = mode.rounds;
```

## Round Generation

Rounds are created by `buildRound(levelKey, themeKey, roundNumber)`.

```jsx
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
    pool: [...orderedItems].sort((a, b) => a.name.localeCompare(b.name)),
  };
}
```

What it does:

1. Pulls the selected level from `levels[levelKey]`.
2. Pulls the selected theme from `themes[themeKey]`.
3. Calculates an `offset` so later rounds use different ingredients.
4. Rotates the theme ingredient list from that offset.
5. Takes the first `level.count` ingredients as the recipe.
6. Sorts the full ingredient list alphabetically by `name` for the selectable pool.

The active round is memoized:

```jsx
const round = useMemo(
  () => buildRound(levelKey, themeKey, roundNumber),
  [levelKey, themeKey, roundNumber],
);
```

This means the round is rebuilt only when the level, theme, or round number changes.

## Game State

Main state values:

- `levelKey`: selected difficulty.
- `themeKey`: selected theme.
- `modeKey`: selected mode.
- `roundNumber`: zero-based round index.
- `phase`: current screen state.
- `timeLeft`: memorization timer.
- `selected`: player-selected ingredients in their chosen order.
- `feedback`: result after verification.
- `score`: number of correct rounds.

The `phase` value controls which part of the UI is shown:

- `config`: setup screen.
- `memorize`: recipe is visible and timer counts down.
- `recall`: recipe is hidden, player selects and orders ingredients.
- `ended`: final score screen.

## Game Flow

The intended flow is:

```text
Choose level + theme + mode
-> startGame()
-> startRound(0)
-> phase = "memorize"
-> timer reaches 0
-> phase = "recall"
-> player selects ingredients
-> checkRecipe()
-> feedback shown
-> nextRound() or final screen
```

## Timer Logic

The timer runs only during the `memorize` phase:

```jsx
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
```

When `timeLeft` reaches `0`, the recipe disappears and recall begins.

## Ingredient Selection

`toggleIngredient(item)` adds or removes an ingredient from `selected`.

Important rules:

- It only works during the `recall` phase.
- Clicking an already selected item removes it.
- The player cannot select more than the recipe length.

The selected order matters because `selected` is an ordered array.

Ingredient matching uses `item.name`, not the full object reference. This keeps answer checking stable even though each ingredient also contains an emoji.

## Reordering

`moveSelected(index, direction)` swaps an ingredient with the one before or after it.

- `direction = -1`: move up.
- `direction = 1`: move down.

This lets the player correct the sequence before verifying.

## Verification

`checkRecipe()` compares the selected sequence to the recipe:

```jsx
const correct =
  selected.length === round.recipe.length &&
  selected.every((item, index) => item === round.recipe[index]);
```

The player must select the right ingredients in the right order.

If correct:

- Feedback shows `MATCH CONFIRMED`.
- `score` increases by 1.
- The verify button is disabled so the same round cannot be scored twice.

If incorrect:

- Feedback shows `SEQUENCE MISMATCH`.
- The correct order is displayed.

## Styling

Most layout and components use Bootstrap classes directly in JSX:

- Grid: `container`, `row`, `col-*`
- Cards: `card`, `card-header`, `card-body`
- Controls: `btn`, `form-select`, `badge`, `progress`
- Spacing: `py-*`, `mb-*`, `gap-*`

`GameSitePage.css` only adds the game-specific terminal look:

- Dark green background.
- Terminal card colors.
- Selected sequence row colors.
- Terminal stat panels.
- Minor button color overrides.
- Local Noto Color Emoji font loading for ingredient icons.

This keeps custom CSS small and scoped to `.game-shell`.

Emoji rendering uses the bundled font file:

```css
@font-face {
  font-family: "Noto Color Emoji Local";
  src: url("../../assets/Noto_Color_Emoji/NotoColorEmoji-Regular.ttf") format("truetype");
}
```

Every visible ingredient goes through the `IngredientLabel` component, which places the emoji on the left and the name on the right.

## Adding New Content

### Add a New Level

Add a new entry to `levels`:

```jsx
expert: { label: "Expert", count: 9, seconds: 3 },
```

Make sure every theme has at least `count` ingredients.

### Add a New Theme

Add a new entry to `themes`:

```jsx
herbal: {
  label: "Herbal Garden",
  command: "mix --garden --memory",
  recipeNoun: "Blend",
  items: [
    { emoji: "🌿", name: "Sage" },
    { emoji: "🌱", name: "Rosemary" },
    { emoji: "🍃", name: "Mint" },
  ],
},
```

Use at least as many items as the largest level requires.

### Add a New Mode

Add a new entry to `modes`:

```jsx
sprint: { label: "Sprint", rounds: 3 },
```

Use `rounds: null` for endless mode.
