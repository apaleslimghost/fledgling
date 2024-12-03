import { ActionFunctionArgs } from "@remix-run/node";
import dbServer from "~/lib/db.server";
import { withZod } from "@rvf/zod";
import { z } from "zod";
import { useForm, validationError } from "@rvf/remix";
import { Await, Form, Link, useLoaderData } from "@remix-run/react";
import { Tag } from "@prisma/client";
import { Suspense } from "react";

const validator = withZod(
  z.object({
    text: z.string(),
    tags: z.string(),
  }),
)

export async function action({request}: ActionFunctionArgs) {
  const result = await validator.validate(await request.formData());

  if (result.error) {
    return validationError(result.error, result.submittedData);
  }

  await dbServer.task.create({
    data: {
      text: result.data.text,
      tags: {
        connectOrCreate: result.data.tags.split(' ').map(tag => ({
          where: { path: tag },
          create: { path: tag }
        }))
      }
    }
  })

  return null
}

function NewTask() {
  const form = useForm({
    validator,
    method: 'POST'
  });

  return <Form {...form.getFormProps()}>
    <input name="text" placeholder="task..." />
    <input name="tags" placeholder="#tags" />
    <input type="submit" />
  </Form>
}

export async function loader() {
  const tasks = await dbServer.task.findMany()
  const tags = await dbServer.tag.findMany()
  return {tasks, tags}
}

function Sidebar({ tags }: { tags: Tag[] }) {
  return <ul>
    {tags.map(tag => <li key={tag.id}>
      <Link to={`/tag/${tag.path}`}>#{tag.path}</Link>
    </li>)}
  </ul>
}

export default function Index() {
  const {tasks, tags} = useLoaderData<typeof loader>()

  return <>
    <NewTask />

    <Sidebar tags={tags} />

    <ul>
      {tasks.map(task => <li key={task.id}>
        <Link to={`/task/${task.id}`}>{task.text}</Link>
      </li>)}
    </ul>
  </>
}
