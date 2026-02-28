/**
 * Design System Table Row
 * Use within a table body. Includes hover state.
 */
const DSTableRow = ({ children, className = "" }) => (
  <tr
    className={`border-b border-border transition-colors duration-150 hover:bg-border-muted/50 ${className}`}
  >
    {children}
  </tr>
);

export const DSTableHeader = ({ children, className = "" }) => (
  <thead>
    <tr
      className={`border-b border-border bg-border-muted/30 text-left text-sm font-semibold text-text-secondary uppercase tracking-wider ${className}`}
    >
      {children}
    </tr>
  </thead>
);

export const DSTableCell = ({
  children,
  className = "",
  header = false,
}) => {
  const base = "px-4 py-3 text-sm";
  const textClass = header
    ? "font-semibold text-text-primary"
    : "text-text-secondary";
  return (
    <td className={`${base} ${textClass} ${className}`}>
      {children}
    </td>
  );
};

export const DSBadge = ({
  children,
  variant = "default", // "default" | "success" | "warning" | "danger" | "info"
}) => {
  const variants = {
    default:
      "bg-border-muted text-text-secondary",
    success:
      "bg-status-success-muted text-status-success",
    warning:
      "bg-status-warning-muted text-status-warning",
    danger:
      "bg-status-danger-muted text-status-danger",
    info:
      "bg-status-info-muted text-status-info",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

export default DSTableRow;
