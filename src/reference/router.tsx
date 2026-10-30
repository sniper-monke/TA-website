/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import { useState } from "react";
import {
  useLocation as useTanstackLocation,
  useParams as useTanstackParams,
} from "@tanstack/react-router";
export function Link({ to, children, ...props }) {
  return (
    <a href={to} {...props}>
      {children}
    </a>
  );
}
export function NavLink({ to, children, className, ...props }) {
  const { pathname } = useLocation();
  return (
    <a
      href={to}
      className={
        typeof className === "function" ? className({ isActive: pathname === to }) : className
      }
      {...props}
    >
      {children}
    </a>
  );
}
export function useLocation() {
  return useTanstackLocation();
}
export function useParams() {
  return useTanstackParams({ strict: false });
}
export function useSearchParams() {
  const location = useTanstackLocation();
  const [search, setSearch] = useState(location.searchStr || "");
  return [
    new URLSearchParams(search),
    (params, options) => {
      const next = `?${params}`;
      window.history[options?.replace ? "replaceState" : "pushState"](
        window.history.state,
        "",
        next,
      );
      setSearch(next);
    },
  ];
}
