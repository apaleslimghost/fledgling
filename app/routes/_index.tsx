import dbServer from "~/lib/db.server";
import { useLoaderData } from "@remix-run/react";
import TaskGrid from "~/components/task-grid";

export async function loader() {
  return {tasks: await dbServer.task.findMany({
    include: {tags: true}
  })}
}

export default function Index() {
  const {tasks} = useLoaderData<typeof loader>()

  return <TaskGrid tasks={tasks} />
}
