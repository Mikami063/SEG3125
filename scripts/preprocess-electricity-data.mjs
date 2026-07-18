import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const input = resolve(root, "src/assets/25100015.csv");
const output = resolve(root, "src/pages/ElectricityDashboard/data/electricity.json");
const wantedClass = "Total all classes of electricity producer";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const character = text[i];
    if (quoted) {
      if (character === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (character === '"') quoted = false;
      else field += character;
    } else if (character === '"') quoted = true;
    else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else field += character;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const rawRows = parseCsv((await readFile(input, "utf8")).replace(/^\uFEFF/, ""));
const headers = rawRows.shift();
const column = Object.fromEntries(headers.map((header, index) => [header, index]));
const selected = rawRows.filter((row) => row[column["Class of electricity producer"]] === wantedClass);
const dates = [...new Set(selected.map((row) => row[column.REF_DATE]))].sort();
const geographies = [...new Set(selected.map((row) => row[column.GEO]))];
const types = [...new Set(selected.map((row) => row[column["Type of electricity generation"]]))];
const dateId = new Map(dates.map((value, index) => [value, index]));
const geographyId = new Map(geographies.map((value, index) => [value, index]));
const typeId = new Map(types.map((value, index) => [value, index]));

const values = selected.flatMap((row) => {
  const rawValue = row[column.VALUE];
  if (rawValue === "") return [];
  return [[
    dateId.get(row[column.REF_DATE]),
    geographyId.get(row[column.GEO]),
    typeId.get(row[column["Type of electricity generation"]]),
    Number(rawValue),
  ]];
});

const payload = {
  source: "Statistics Canada table 25-10-0015-01",
  unit: "MWh",
  dates,
  geographies,
  types,
  values,
};

await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify(payload));
console.log(`Wrote ${values.length.toLocaleString()} published values to ${output}`);
