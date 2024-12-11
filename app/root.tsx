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
import {Theme, Flex, Box, Button} from '@radix-ui/themes'
import "@radix-ui/themes/styles.css"
import dbServer from "./lib/db.server";
import TagTree from "~/components/tag-tree";
import { FilePlusIcon } from "@radix-ui/react-icons";
import 'tippy.js/dist/tippy.css';

export async function loader() {
  return {
    tags: await dbServer.tag.findMany()
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
        <Theme accentColor="iris" grayColor="mauve" radius="large" scaling="105%">
          <Flex gap='6'>
            <Box flexBasis='16em'>
              <Form method='post'>
                <Button>
                  <FilePlusIcon />
                  Create
                </Button>
              </Form>

              {tags && <TagTree tags={tags} />}
            </Box>

            {children}
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
