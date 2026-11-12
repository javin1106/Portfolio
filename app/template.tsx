/**
 * A template (unlike a layout) remounts on every navigation, so each page
 * re-runs the same "come into focus" entrance when you switch sections.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
