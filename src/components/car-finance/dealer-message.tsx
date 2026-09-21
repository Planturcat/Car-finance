'use client';

import { useEffect, useState } from 'react';
import { Copy, Check, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  message: string;
};

const DealerMessage = ({ message }: Props) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function onWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="scroll-mt-28 h-full rounded-2xl border border-foreground/10 bg-background p-6 md:p-8 flex flex-col">
      <p className="text-xs font-mono text-foreground/40 mb-2">&lt;dealer-message&gt;</p>
      <h3 className="text-xl md:text-2xl font-heading font-bold tracking-tight text-foreground">
        Message a dealer
      </h3>
      <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
        Your deal, turned into a WhatsApp-ready note. Tweak the numbers - this updates with them.
      </p>

      <div
        className="mt-6 flex-1 rounded-xl border border-foreground/10 bg-foreground/[0.03] p-4 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap"
        aria-live="polite"
      >
        {message}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button type="button" className="shadow-none" onClick={onCopy} aria-label="Copy dealer message">
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Copied' : 'Copy message'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="shadow-none"
          onClick={onWhatsApp}
          aria-label="Share dealer message on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>
      </div>
    </div>
  );
};

export default DealerMessage;
