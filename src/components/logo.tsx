import { ShieldCheck } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <ShieldCheck className="h-8 w-8 text-primary" />
      <h1 className="text-xl font-bold text-foreground">FraudLens</h1>
    </div>
  );
}
