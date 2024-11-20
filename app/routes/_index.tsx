import { ActionFunctionArgs } from "@remix-run/node";
import dbServer from "~/lib/db.server";
import { withZod } from "@rvf/zod";
import { z } from "zod";
import { useForm, validationError } from "@rvf/remix";
import { Form, useLoaderData } from "@remix-run/react";

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
  return {tasks}
}

export default function Index() {
  const {tasks} = useLoaderData<typeof loader>()
  return <>
    <NewTask />

    <ul>
      {tasks.map(task => <li key={task.id}>{task.text}</li>)}
    </ul>
  </>
}