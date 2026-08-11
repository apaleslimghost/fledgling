import type { Route } from "./+types/home";
import { useAll, useDb } from "jazz-tools/react";
import { app } from "../../schema";
import { useState } from "react";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	const notes = useAll(app.notes) ?? []

	return <ul>
		{notes.map(note => <li key={note.id}><a href={`/note/${note.id}`}>{note.title}</a></li>)}
	</ul>;
}
