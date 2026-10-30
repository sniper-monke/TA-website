/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Field = ({ label, id, multiline, className = "", ...props }) => (
  <label className={`field ${className}`} htmlFor={id}>
    <span>{label}</span>
    {multiline ? (
      <Textarea id={id} data-testid={id} {...props} />
    ) : (
      <Input id={id} data-testid={id} {...props} />
    )}
  </label>
);

export const ErrorNotice = ({ children, id = "form-error" }) =>
  children ? (
    <p className="error-notice" role="alert" data-testid={id}>
      {children}
    </p>
  ) : null;
