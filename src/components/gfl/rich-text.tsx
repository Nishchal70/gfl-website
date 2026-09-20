/**
 * Tiny rich-text renderer for editable content.
 * Supports: **bold**, __red underlined accent__, \n line breaks,
 * and blank lines (\n\n) for paragraph breaks.
 */

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
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
