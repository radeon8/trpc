// Path: src/utils/trpc.ts
export const UTILS_TRPC = `import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { AppRouter } from '~/server/routers/_app';

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // In the browser, we return a relative URL
    return '';
  }
  // When rendering on the server, we return an absolute URL

  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return \`https://\${process.env.VERCEL_URL}\`;
  }

  // assume localhost
  return \`http://localhost:\${process.env.PORT ?? 3000}\`;
}

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: getBaseUrl() + '/api/trpc',
        }),
      ],
    };
  },
  ssr: true,
});`;

// Path: src/pages/_app.tsx
export const NEXTJS_PAGES_APP = `import type { AppType } from 'next/app';
import { trpc } from '~/utils/trpc';

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default trpc.withTRPC(MyApp);
`;

// Path: src/pages/api/trpc/[trpc].ts
export const NEXTJS_API_HANDLER = `import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from "~/server/routers/_app";
import { createContext } from "~/server/context";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
});`;

// Path: src/server/routers/_app.ts
export const APP_ROUTER = `const appRouter = router({
  greeting: publicProcedure
    .input(
      z.object({
        name: z.string().nullish(),
      }),
    )
    .query(({ input }) => {
      return {
        text: \`hello \${input.name}\`,
      };
    }),
});

export type AppRouter = typeof appRouter;`;

// Path: src/server/context.ts
export const NEXTJS_CONTEXT = `import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

interface CreateContextOptions {
  // session: Session | null
}

export async function createContextInner(_opts: CreateContextOptions) {
  return {};
}

export async function createContext(
  opts: trpcNext.CreateNextContextOptions,
): Promise<Context> {
  return await createContextInner({});
}`;

// Path: src/server/trpc.ts
export const SERVER_TRPC_TS = `import { initTRPC } from '@trpc/server';
import { createContext } from './context';

const t = initTRPC.create<typeof createContext>();

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

export const router = t.router;
export const middleware = t.middleware;`;
