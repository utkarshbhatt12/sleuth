import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ExtensionList from './ExtensionList';

interface Extension {
  id: string;
  name: string;
  networkRequests: number;
  urls: { [key: string]: number };
}

export default function Popup() {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchExtensions = () => {
    if (
      typeof chrome !== 'undefined' &&
      chrome.runtime &&
      chrome.runtime.sendMessage
    ) {
      chrome.runtime.sendMessage(
        { action: 'getExtensionRequests' },
        (response) => {
          if (chrome.runtime.lastError) {
            setError(`Error: ${chrome.runtime.lastError.message}`);
          } else {
            setExtensions(response.extensions);
            setTotalRequests(response.totalRequests);
          }
        }
      );
    } else {
      // Fallback for development environment
      setExtensions([
        {
          id: '1',
          name: 'Sample Extension 1',
          networkRequests: 10,
          urls: {
            'https://example.com/api/data': 5,
            'https://api.example.com/users': 5,
          },
        },
        {
          id: '2',
          name: 'Sample Extension 2',
          networkRequests: 20,
          urls: {
            'https://google.com/search': 10,
            'https://api.github.com/repos': 10,
          },
        },
      ]);
      setTotalRequests(30);
    }
  };

  useEffect(() => {
    fetchExtensions();
  }, []);

  const handleReset = () => {
    if (
      typeof chrome !== 'undefined' &&
      chrome.runtime &&
      chrome.runtime.sendMessage
    ) {
      chrome.runtime.sendMessage({ action: 'resetCounter' }, (response) => {
        if (response.success) {
          fetchExtensions();
        }
      });
    }
  };

  return (
    <div className="w-96 h-[600px] bg-white text-gray-800 font-mono flex flex-col">
      <header className="bg-gray-800 text-white p-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sleuth</h1>
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="bg-transparent text-white border-white hover:bg-white hover:text-gray-800 transition-colors"
          >
            Reset
          </Button>
        </div>
        <div className="mt-1">Total Requests: {totalRequests}</div>
      </header>
      <Separator className="bg-gray-300" />
      <main className="flex-1 overflow-hidden p-2">
        {error ? (
          <div className="text-red-500 mb-2">{error}</div>
        ) : (
          <ScrollArea className="h-full">
            <ExtensionList extensions={extensions} />
          </ScrollArea>
        )}
      </main>
    </div>
  );
}
