
interface PullQuoteProps {
  quote: string;
  attribution?: string;
  className?: string;
}

export default function PullQuote({ quote, attribution, className = '' }: PullQuoteProps) {
  return (
    <aside className={`pull-quote ${className}`}>
      <blockquote className="pull-quote-content">
        {quote}
      </blockquote>
      {attribution && (
        <cite className="pull-quote-attribution">
          {attribution}
        </cite>
      )}
    </aside>
  );
}
