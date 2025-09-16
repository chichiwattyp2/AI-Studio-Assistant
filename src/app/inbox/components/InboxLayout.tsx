'use client';

import { useState } from 'react';
import ThreadList from './ThreadList';
import MessageFeed from './MessageFeed';
import CustomerPanel from './CustomerPanel';
import { Prisma } from '@prisma/client';

type ThreadWithDetails = Prisma.ThreadGetPayload<{
  include: { contact: true; messages: true; };
}>

interface InboxLayoutProps {
    initialThreads: ThreadWithDetails[];
}

export default function InboxLayout({ initialThreads }: InboxLayoutProps) {
  const [threads, setThreads] = useState(initialThreads);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(initialThreads[0]?.id || null);

  const selectedThread = threads.find(t => t.id === selectedThreadId);

  // TODO: Implement real-time updates via WebSockets or polling (e.g., useSWR)

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full max-h-full overflow-hidden">
      <div className="md:col-span-3 h-full max-h-full">
        <ThreadList 
          threads={threads} 
          selectedThreadId={selectedThreadId} 
          onSelectThread={setSelectedThreadId} 
        />
      </div>
      <div className="md:col-span-6 h-full max-h-full flex flex-col">
        {selectedThread ? (
          <MessageFeed thread={selectedThread} />
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-800/20 rounded-2xl">
            <p>Select a conversation to start</p>
          </div>
        )}
      </div>
      <div className="md:col-span-3 h-full max-h-full">
        {selectedThread ? (
          <CustomerPanel contact={selectedThread.contact} />
        ) : (
            <div className="bg-slate-800/20 rounded-2xl h-full" />
        )}
      </div>
    </div>
  );
}
