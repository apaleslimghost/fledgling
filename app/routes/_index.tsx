import dbServer from "~/lib/db.server";
import { useLoaderData } from "@remix-run/react";
import NoteGrid from "~/components/note-grid";

export async function loader() {
  return {notes: await dbServer.note.findMany({
    include: {tags: true}
  })}
}

export default function Index() {
  const {notes} = useLoaderData<typeof loader>()

  return <NoteGrid notes={notes} />
}
