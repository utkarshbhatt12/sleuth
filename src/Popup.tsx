import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Activity } from 'lucide-react';
import ExtensionList from './ExtensionList';
import { Extension } from './types';

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
            const sortedExtensions = response.extensions
              .filter((ext: Extension) => ext.networkRequests > 0)
              .sort(
                (a: Extension, b: Extension) =>
                  b.lastRequestTime - a.lastRequestTime
              );
            setExtensions(sortedExtensions);
            setTotalRequests(response.totalRequests);
          }
        }
      );
    } else {
      // Fallback for development environment
      const mockExtensions: Extension[] = [
        {
          id: '1',
          name: 'Sample Extension 1',
          networkRequests: 10,
          urls: {
            'https://example.com/api/data': 5,
            'https://api.example.com/users': 5,
          },
          lastRequestTime: Date.now() - 5000,
        },
        {
          id: '2',
          name: 'Sample Extension 2',
          networkRequests: 20,
          urls: {
            'https://google.com/search': 10,
            'https://api.github.com/repos': 10,
          },
          lastRequestTime: Date.now() - 1000,
        },
      ];
      setExtensions(
        mockExtensions.sort((a, b) => b.lastRequestTime - a.lastRequestTime)
      );
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
        ) : extensions.length > 0 ? (
          <ScrollArea className="h-full">
            <ExtensionList extensions={extensions} />
          </ScrollArea>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <Activity size={64} className="mb-4" />
            <p className="text-center">No network activity detected yet.</p>
            <p className="text-center text-sm mt-2">
              Use Chrome normally and check back later!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
