import { EditorProvider, EditorProviderProps } from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";

const extensions = [
	StarterKit
]

export default function Editor(props: Omit<EditorProviderProps, 'extensions'>) {
	return <EditorProvider {...props} extensions={extensions} />
}
