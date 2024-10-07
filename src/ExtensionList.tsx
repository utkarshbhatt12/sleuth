import { Accordion } from '@/components/ui/accordion';
import ExtensionItem from './ExtensionItem';
import { ExtensionListProps } from './types';

export default function ExtensionList({ extensions }: ExtensionListProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {extensions.map((extension) => (
        <ExtensionItem key={extension.id} extension={extension} />
      ))}
    </Accordion>
  );
}
