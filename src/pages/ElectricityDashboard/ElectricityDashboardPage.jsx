import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import data from "./data/electricity.json";
import ChartPanel from "./components/ChartPanel";
import KpiGrid from "./components/KpiGrid";
import { geographyFr, translations, typeKeys } from "./i18n";
import "./ElectricityDashboardPage.css";

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip);

const colors = { total: "#0b6e75", hydro: "#247ba0", nuclear: "#7857a7", wind: "#4d9c65", solar: "#e2a62b", tidal: "#3c91a3", other: "#87929b", combustible: "#d06449", conventionalSteam: "#a96d4c", internalCombustion: "#b75948", combustion: "#d67b45", nonRenewable: "#bb5847", biomass: "#7d9d57" };
const totalType = "Total all types of electricity generation";
const mixTypes = ["Hydraulic turbine", "Nuclear steam turbine", "Wind power turbine", "Solar", "Tidal power turbine", "Other types of electricity generation", "Total electricity production from combustible fuels"];

function monthDate(month) { const [year, part] = month.split("-").map(Number); return new Date(Date.UTC(year, part - 1, 1)); }

export default function ElectricityDashboardPage() {
  const [language, setLanguage] = useState("en");
  const [geography, setGeography] = useState("Canada");
  const [type, setType] = useState(totalType);
  const [start, setStart] = useState(data.dates[Math.max(0, data.dates.length - 60)]);
  const [end, setEnd] = useState(data.dates.at(-1));
  const [month, setMonth] = useState(data.dates.at(-1));
  const t = translations[language];
  const typeLabel = (value) => t[typeKeys[value]] || value;
  const geoLabel = (value) => language === "fr" ? geographyFr[value] || value : value;
  const formatMonth = (value, short = false) => new Intl.DateTimeFormat(t.locale, { month: short ? "short" : "long", year: "numeric", timeZone: "UTC" }).format(monthDate(value));
  const formatNumber = (value, compact = false) => value == null ? t.unavailable : new Intl.NumberFormat(t.locale, compact ? { notation: "compact", maximumFractionDigits: 1 } : { maximumFractionDigits: 0 }).format(value);

  const lookup = useMemo(() => {
    const map = new Map();
    data.values.forEach(([dateIndex, geoIndex, typeIndex, value]) => map.set(`${dateIndex}|${geoIndex}|${typeIndex}`, value));
    return map;
  }, []);
  const valueAt = (dateValue, geoValue, typeValue) => lookup.get(`${data.dates.indexOf(dateValue)}|${data.geographies.indexOf(geoValue)}|${data.types.indexOf(typeValue)}`) ?? null;

  const lineMonths = data.dates.filter((value) => value >= start && value <= end);
  const lineValues = lineMonths.map((value) => valueAt(value, geography, type));
  const latestIndex = [...lineValues].map((value, index) => [value, index]).reverse().find(([value]) => value != null)?.[1];
  const latestValue = latestIndex == null ? null : lineValues[latestIndex];
  const latestDate = latestIndex == null ? null : lineMonths[latestIndex];
  const sourceValues = mixTypes.map((source) => ({ source, value: valueAt(month, geography, source) })).filter(({ value }) => value != null && value > 0);
  const latestSources = mixTypes.map((source) => ({ source, value: latestDate ? valueAt(latestDate, geography, source) : null })).filter(({ value }) => value != null);
  const largest = latestSources.reduce((best, item) => !best || item.value > best.value ? item : best, null);
  const provinceValues = data.geographies.filter((value) => value !== "Canada").map((geo) => ({ geo, value: valueAt(month, geo, type) })).filter(({ value }) => value != null).sort((a, b) => b.value - a.value);
  const crossesMethodChange = start < "2016-01" && end >= "2016-01";

  const commonOptions = { responsive: true, maintainAspectRatio: false, animation: { duration: 350 }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `${context.dataset.label || t.values}: ${formatNumber(context.raw)} ${t.mwh}` } } }, scales: { y: { beginAtZero: true, ticks: { callback: (value) => formatNumber(value, true) }, grid: { color: "rgba(24,55,61,.09)" } }, x: { grid: { display: false } } } };
  const select = (label, value, setter, options) => <label><span>{label}</span><select value={value} onChange={(event) => setter(event.target.value)}>{options.map((option) => <option key={option} value={option}>{option.includes("-") && /^\d/.test(option) ? formatMonth(option) : option}</option>)}</select></label>;

  return <main className="electric-shell" lang={language}>
    <header className="electric-header">
      <Link to="/" className="back-link">← {t.back}</Link>
      <button className="language-button" onClick={() => setLanguage(language === "en" ? "fr" : "en")} aria-label={`${t.language}: ${t.switchLanguage}`}>◉ {t.switchLanguage}</button>
    </header>
    <div className="dashboard-wrap">
      <section className="dashboard-intro"><div><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p>{t.intro}</p></div><div className="source-badge"><span aria-hidden="true">⚡</span>{t.source}</div></section>
      <section className="global-filters" aria-labelledby="filter-title"><h2 id="filter-title">{t.filters}</h2><div className="filter-row">
        {select(t.geography, geoLabel(geography), (label) => setGeography(data.geographies.find((item) => geoLabel(item) === label)), data.geographies.map(geoLabel))}
        {select(t.generationType, typeLabel(type), (label) => setType(data.types.find((item) => typeLabel(item) === label)), data.types.map(typeLabel))}
        <fieldset><legend>{t.dateRange}</legend><div className="date-pair">{select(t.from, start, (value) => { setStart(value); if (value > end) setEnd(value); }, data.dates)}{select(t.to, end, (value) => { setEnd(value); if (value < start) setStart(value); }, data.dates)}</div></fieldset>
      </div></section>
      <KpiGrid items={[
        { label: t.latestMonth, value: latestDate ? formatMonth(latestDate) : t.unavailable, icon: "◷" },
        { label: t.selectedGeneration, value: formatNumber(latestValue, true), detail: latestValue == null ? "" : t.mwh, icon: "↗" },
        { label: t.largestSource, value: largest ? typeLabel(largest.source) : t.unavailable, detail: largest ? `${formatNumber(largest.value, true)} ${t.mwh}` : "", icon: "⚡" },
        { label: t.selectedGeography, value: geoLabel(geography), icon: "⌖" },
      ]} />
      <ChartPanel title={t.monthlyTitle} text={t.monthlyText} note={crossesMethodChange ? t.methodology : null} className="wide-panel">
        {lineValues.some((value) => value != null) ? <div className="chart-box line-box"><Line data={{ labels: lineMonths.map((value) => formatMonth(value, true)), datasets: [{ label: typeLabel(type), data: lineValues, borderColor: colors[typeKeys[type]], backgroundColor: `${colors[typeKeys[type]]}20`, fill: true, tension: .25, pointRadius: lineMonths.length > 36 ? 0 : 2, spanGaps: false }] }} options={commonOptions} /></div> : <div className="empty-state">{t.noData}</div>}
      </ChartPanel>
      <div className="dashboard-grid">
        <ChartPanel title={t.comparisonTitle} text={t.comparisonText} note={t.missingNote} controls={select(t.month, month, setMonth, data.dates)}>
          {provinceValues.length ? <div className="chart-box bar-box"><Bar data={{ labels: provinceValues.map(({ geo }) => geoLabel(geo)), datasets: [{ label: typeLabel(type), data: provinceValues.map(({ value }) => value), backgroundColor: "#2f8890", borderRadius: 5 }] }} options={{ ...commonOptions, indexAxis: "y", scales: { x: { beginAtZero: true, ticks: { callback: (value) => formatNumber(value, true) }, grid: { color: "rgba(24,55,61,.09)" } }, y: { grid: { display: false } } } }} /></div> : <div className="empty-state">{t.noData}</div>}
        </ChartPanel>
        <ChartPanel title={t.mixTitle} text={t.mixText} controls={select(t.month, month, setMonth, data.dates)}>
          {sourceValues.length ? <><div className="chart-box donut-box"><Doughnut data={{ labels: sourceValues.map(({ source }) => typeLabel(source)), datasets: [{ data: sourceValues.map(({ value }) => value), backgroundColor: sourceValues.map(({ source }) => colors[typeKeys[source]]), borderColor: "#fff", borderWidth: 3 }] }} options={{ responsive: true, maintainAspectRatio: false, cutout: "66%", plugins: { legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8, padding: 14 } }, tooltip: commonOptions.plugins.tooltip } }} /></div><p className="sr-only">{t.chartSummary}: {sourceValues.map(({ source, value }) => `${typeLabel(source)} ${formatNumber(value)} ${t.mwh}`).join(", ")}</p></> : <div className="empty-state">{t.noData}</div>}
        </ChartPanel>
      </div>
      <footer><p>{t.source}</p></footer>
    </div>
  </main>;
}
