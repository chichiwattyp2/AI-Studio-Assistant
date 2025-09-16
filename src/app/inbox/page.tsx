// This is a Server Component, it fetches initial data on the server.
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import InboxLayout from "./components/InboxLayout"
import { prisma } from "@/lib/db"

async function getInboxData() {
  // In a real app, you would fetch threads for the logged-in user's team
  const threads = await prisma.thread.findMany({
    include: {
      contact: true,
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1
      },
    },
    orderBy: {
      lastMessageAt: 'desc',
    }
  });
  return { threads };
}

export default async function InboxPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // You can also use NextAuth middleware for this
    redirect('/api/auth/signin');
  }

  const { threads } = await getInboxData();

  return (
    <main className="h-screen w-full p-4">
        <InboxLayout initialThreads={threads} />
    </main>
  );
}
