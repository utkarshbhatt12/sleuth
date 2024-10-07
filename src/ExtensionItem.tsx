import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { ExtensionItemProps } from './types';

export default function ExtensionItem({ extension }: ExtensionItemProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <AccordionItem value={extension.id} className="border-b">
      <AccordionTrigger className="hover:no-underline py-2">
        <div className="flex justify-between w-full items-center">
          <span className="font-medium">{extension.name}</span>
          <div className="text-sm text-right">
            <div>{extension.networkRequests} requests</div>
            <div className="text-xs text-gray-500">
              Last: {formatTime(extension.lastRequestTime)}
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="py-1">
        <ul className="space-y-1 text-sm">
          {Object.entries(extension.urls).map(([url, count]) => (
            <li key={url} className="flex flex-col">
              <span className="break-all">{url}</span>
              <span className="text-xs text-gray-500">
                {count} request{count !== 1 ? 's' : ''}
              </span>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}
