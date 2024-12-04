import { Tag } from "@prisma/client";
import { Link } from "@remix-run/react";

export default function TagTree({ tags }: { tags: Tag[] }) {
	return <ul>
    {tags.map(tag => <li key={tag.id}>
      <Link to={`/tag/${tag.path}`}>#{tag.path}</Link>
    </li>)}
  </ul>
}
