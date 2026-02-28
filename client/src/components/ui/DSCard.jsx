/**
 * Design System Card
 * Neutral surface with subtle border. Use for content containers.
 */
const DSCard = ({ children, className = "", hover = false, ...props }) => {
  const base =
    "rounded-xl bg-surface border border-border shadow-sm overflow-hidden";
  const hoverClass = hover
    ? "transition-shadow duration-200 hover:shadow-md"
    : "";
  return (
    <div className={`${base} ${hoverClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const DSCardHeader = ({ title, subtitle, action, className = "" }) => (
  <div
    className={`flex items-start justify-between gap-4 p-5 border-b border-border ${className}`}
  >
    <div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {subtitle && (
        <p className="mt-0.5 text-sm text-text-secondary">{subtitle}</p>
      )}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const DSCardBody = ({ children, className = "" }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

export default DSCard;
