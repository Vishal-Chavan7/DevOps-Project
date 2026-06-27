import type { ReactNode } from "react";
import { FileText } from "lucide-react";

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-surface/40 px-6 py-20 text-center">
      <div className="mb-4 grid size-12 place-items-center rounded-full border border-border text-muted-foreground">
        {icon ?? <FileText className="size-5" />}
      </div>
      <h3 className="font-serif text-xl">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
