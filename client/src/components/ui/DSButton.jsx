/**
 * Design System Button
 * Tailwind classes: primary, secondary, ghost, danger
 */
const DSButton = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-brand text-white hover:bg-brand-hover focus:ring-brand shadow-sm hover:shadow",
    secondary:
      "bg-surface border border-border text-text-primary hover:bg-border-muted focus:ring-border",
    ghost:
      "bg-transparent text-text-secondary hover:bg-border-muted hover:text-text-primary focus:ring-border-muted",
    danger:
      "bg-status-danger text-white hover:bg-status-danger/90 focus:ring-status-danger",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-3",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default DSButton;
