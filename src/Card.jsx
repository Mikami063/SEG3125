import { Link } from 'react-router-dom';

export default function MultiActionAreaCard({image, label, title, content, to}) {
  return (
    <div className="card" style={{ width: 345 }}>
      <img
        className="card-img-top"
        src={image}
        alt={label}
        style={{ height: 140, objectFit: "cover" }}
      />
      <div className="card-body">
        <h3 className="h5 card-title">{title}</h3>
        <p className="card-text text-secondary">{content}</p>
        <Link className="btn btn-primary btn-sm" to={to}>
          Open
        </Link>
      </div>
    </div>
  );
}
