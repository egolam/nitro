interface ProgressBarProps {
  current: number;
  total: number;
  threshold?: number;
}

export function ProgressBar({ current, total, threshold }: ProgressBarProps) {
  const validAmount = threshold
    ? Math.floor(current / threshold) * threshold
    : current;
  const pendingAmount = threshold ? Math.max(0, current - validAmount) : 0;

  const validPercent = Math.min((validAmount / total) * 100, 100);
  const pendingPercent = Math.min(
    (pendingAmount / total) * 100,
    100 - validPercent,
  );

  return (
    <div className="h-5 w-full bg-accent rounded-xs relative overflow-hidden">
      {validPercent > 0 && (
        <div
          className={`h-5 absolute left-0 bg-green-600 transition-all duration-500 ease-in-out ${
            pendingPercent === 0 ? "rounded-r-xs" : ""
          }`}
          style={{ width: `${validPercent}%` }}
        ></div>
      )}
      {pendingPercent > 0 && (
        <div
          className="h-5 absolute bg-orange-500 rounded-r-xs transition-all duration-500 ease-in-out"
          style={{ left: `${validPercent}%`, width: `${pendingPercent}%` }}
        ></div>
      )}
      <p className="text-xs text-black leading-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-medium">
        {current}/{total}gr
      </p>
    </div>
  );
}
