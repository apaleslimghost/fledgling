import {
  Form,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "@remix-run/react";
import {Theme, Flex, Box, Button, ScrollArea} from '@radix-ui/themes'
import dbServer from "./lib/db.server";
import TagTree from "~/components/tag-tree";
import { FilePlusIcon } from "@radix-ui/react-icons";

import "@radix-ui/themes/styles.css"
import 'tippy.js/dist/tippy.css';
import '~/css/index.css';

export async function loader() {
  const tags = await dbServer.tag.findMany({
    include: {
      notes: true
    }
  })

  return {
    tags
  }
}

export async function action() {
  const note = await dbServer.note.create({})

  throw redirect(`/note/${note.id}`)
}

export function Layout({ children }: { children: React.ReactNode }) {
  const {tags} = useRouteLoaderData<typeof loader>('root') ?? {}

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Theme accentColor="iris" grayColor="mauve" radius="large" scaling="105%" appearance="light">
          <Flex align='stretch' height='100dvh'>
            <Theme appearance="dark" style={{height: '100%'}}>
              <Box flexBasis='16em' p='3' style={{height: '100%'}}>
                <ScrollArea scrollbars="vertical" type="hover">
                  <Form method='post'>
                    <Button>
                      <FilePlusIcon />
                      Create
                    </Button>
                  </Form>

                  {tags && <TagTree tags={tags} />}
                </ScrollArea>
              </Box>
            </Theme>

            <Box p='3' flexGrow='1' style={{height: '100%'}}>
              <ScrollArea scrollbars="vertical" type="hover">
                {children}
              </ScrollArea>
            </Box>
          </Flex>
        </Theme>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
