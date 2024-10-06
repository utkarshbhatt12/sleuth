import { Accordion } from '@/components/ui/accordion';
import ExtensionItem from './ExtensionItem';

interface Extension {
  id: string;
  name: string;
  networkRequests: number;
  urls: { [key: string]: number };
}

interface ExtensionListProps {
  extensions: Extension[];
}

export default function ExtensionList({ extensions }: ExtensionListProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {extensions.map((extension) => (
        <ExtensionItem key={extension.id} extension={extension} />
      ))}
    </Accordion>
  );
}
