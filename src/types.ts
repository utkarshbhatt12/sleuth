export interface Extension {
  id: string;
  name: string;
  networkRequests: number;
  urls: { [key: string]: number };
  lastRequestTime: number;
}

export interface ExtensionRequests {
  [key: string]: {
    total: number;
    urls: { [key: string]: number };
    lastRequestTime: number;
  };
}

export interface ExtensionListProps {
  extensions: Extension[];
}

export interface ExtensionItemProps {
  extension: Extension;
}
