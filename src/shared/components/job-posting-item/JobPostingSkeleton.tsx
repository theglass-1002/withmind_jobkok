import "./JobPostingSkeleton.css";

type Props = {
  view: "card" | "row";
  count?: number;
};

export default function JobPostingSkeleton({ view, count = 10 }: Props) {
  const items = Array.from({ length: count });

  if (view === "card") {
    return (
      <div
        className="job-posting__list job-posting__list--grid jp-skel"
        aria-busy="true"
        aria-live="polite"
      >
        {items.map((_, i) => (
          <div key={`jp-skel-card-${i}`} className="job-posting__card jp-skel-card">
            <div className="jp-skel-card__header">
              <span className="jp-skel-logo" />
              <div className="jp-skel-card__identity">
                <span className="jp-skel-bar jp-skel-bar--company" />
                <span className="jp-skel-bar jp-skel-bar--title" />
              </div>
              <span className="jp-skel-fav" />
            </div>
            <div className="jp-skel-divider" />
            <div className="jp-skel-card__body">
              <span className="jp-skel-bar jp-skel-bar--meta" />
              <span className="jp-skel-bar jp-skel-bar--meta short" />
              <div className="jp-skel-badges">
                <span className="jp-skel-badge" />
                <span className="jp-skel-badge" />
                <span className="jp-skel-badge short" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="job-posting__list job-posting__list--row jp-skel"
      aria-busy="true"
      aria-live="polite"
    >
      {items.map((_, i) => (
        <div
          key={`jp-skel-row-${i}`}
          className="job-posting__item job-posting__item--row jp-skel-row"
        >
          <div className="jp-skel-row__card">
            <div className="jp-skel-row__top">
              <span className="jp-skel-logo" />
              <div className="jp-skel-row__details">
                <span className="jp-skel-bar jp-skel-bar--company" />
                <span className="jp-skel-bar jp-skel-bar--title" />
                <span className="jp-skel-bar jp-skel-bar--meta" />
              </div>
              <span className="jp-skel-fav" />
            </div>
            <div className="jp-skel-row__bottom">
              <div className="jp-skel-badges">
                <span className="jp-skel-badge" />
                <span className="jp-skel-badge" />
                <span className="jp-skel-badge short" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
