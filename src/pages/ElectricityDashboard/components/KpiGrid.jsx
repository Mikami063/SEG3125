export default function KpiGrid({ items }) {
  return <section className="kpi-grid" aria-label="Key performance indicators">
    {items.map(({ label, value, detail, icon }) => <article className="kpi-card" key={label}>
      <span className="kpi-icon" aria-hidden="true">{icon}</span>
      <p>{label}</p><strong>{value}</strong>{detail && <small>{detail}</small>}
    </article>)}
  </section>;
}
