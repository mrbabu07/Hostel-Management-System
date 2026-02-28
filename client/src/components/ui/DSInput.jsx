/**
 * Design System Input
 * Neutral border, brand focus ring.
 */
const DSInput = ({
  className = "",
  error,
  ...props
}) => (
  <input
    className={`w-full px-4 py-2.5 text-sm text-text-primary placeholder-text-muted bg-surface border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand ${
      error ? "border-status-danger focus:ring-status-danger/30" : "border-border"
    } ${className}`}
    {...props}
  />
);

export default DSInput;
