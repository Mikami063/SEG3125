export default function ChartPanel({ title, text, controls, children, note, className = "" }) {
  return (
    <section className={`electric-panel ${className}`}>
      <div className="panel-heading">
        <div><h2>{title}</h2><p>{text}</p></div>
        {controls && <div className="panel-controls">{controls}</div>}
      </div>
      {children}
      {note && <p className="chart-note">{note}</p>}
    </section>
  );
}
