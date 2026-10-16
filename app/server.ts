import "react-router";
import { createRequestHandler } from "@react-router/express";
import { createRxServer } from 'rxdb-server/plugins/server';
import { RxServerAdapterExpress } from 'rxdb-server/plugins/adapter-express';

import express from "express";
import database from "./data/rxdb";

const rxServer = await createRxServer({
	database,
	adapter: RxServerAdapterExpress,
	port: 443
});

export const app = rxServer.serverApp

app.use(
	createRequestHandler({
		build: () =>
			import("virtual:react-router/server-build"),
	}),
)
