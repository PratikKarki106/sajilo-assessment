import './ui.css';

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  className = '',
  type,
  ...props
}) {
  const classes = `ui-btn ui-btn-${variant} ${className}`.trim();
  const resolvedType = Component === 'button' ? type || 'button' : type;
  return <Component className={classes} type={resolvedType} {...props} />;
}
