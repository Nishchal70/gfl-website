/**
 * Tiny rich-text renderer for editable content.
 * Supports: **bold**, __red underlined accent__, [link text](target),
 * \n line breaks, and blank lines (\n\n) for paragraph breaks.
 * Link targets starting with # navigate within the site (e.g. #base-layouts);
 * other targets open in a new tab.
 */

const INLINE_PATTERN = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|__[^_]+__)/g;

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(INLINE_PATTERN);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("[") && part.endsWith(")")) {
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const [, label, target] = link;
        const internal = target.startsWith("#");
        return (
          <a
            key={key}
            href={target}
            {...(internal ? {} : { target: "_blank", rel: "noreferrer" })}
            className="text-red-700 underline font-bold hover:text-red-800 transition-colors cursor-pointer"
          >
            {label}
          </a>
        );
      }
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <b key={key}>{part.slice(2, -2)}</b>;
    }
    if (part.startsWith("__") && part.endsWith("__") && part.length > 4) {
      return (
        <span key={key} className="text-red-700 underline font-bold">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={key}>{part}</span>;
  });
}

export function RichText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className={className}>
      {blocks.map((block, bi) => (
        <p key={bi} className={bi > 0 ? "mt-4" : undefined}>
          {block.split("\n").map((line, li) => (
            <span key={li}>
              {li > 0 && <br />}
              {renderInline(line, `${bi}-${li}`)}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
