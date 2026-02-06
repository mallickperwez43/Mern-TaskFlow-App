import { cn } from "@/lib/utils"

export function RetroGrid({
  className,
  angle = 65,
  cellSize = 50,
  opacity = 0.7,
  lightLineColor = "black",
  darkLineColor = "white",
  ...props
}) {
  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
    "--light-line": lightLineColor,
    "--dark-line": darkLineColor
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden perspective-[200px]",
        `opacity-(--opacity)`,
        className
      )}
      style={gridStyles}
      {...props}>
      <div className="absolute inset-0 transform-[rotateX(var(--grid-angle))]">
        <div
          className="animate-grid inset-[0%_0px] ml-[-200%] h-[300vh] w-[600vw] origin-[100%_0_0] bg-[linear-gradient(to_right,var(--light-line)_1px,transparent_0),linear-gradient(to_bottom,var(--light-line)_1px,transparent_0)] bg-size-[var(--cell-size)_var(--cell-size)] bg-repeat dark:bg-[linear-gradient(to_right,var(--dark-line)_1px,transparent_0),linear-gradient(to_bottom,var(--dark-line)_1px,transparent_0)]" />
      </div>
      <div
        className="absolute inset-0 bg-linear-to-t from-white to-transparent to-90% dark:from-black" />
    </div>
  );
}
