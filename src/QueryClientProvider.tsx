"use client";
import React from "react";
import { QueryClient, QueryClientProvider as RQProvider } from "@tanstack/react-query";

// Provide a single QueryClient instance for the app
const queryClient = new QueryClient({
	// minimal sensible defaults; adjust as needed
	defaultOptions: {
		queries: {
			// don't retry by default in dev; change to true if you want retries
			retry: false,
			// avoid refetching on window focus unless desired
			refetchOnWindowFocus: false,
		},
	},
});

export default function QueryClientProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return <RQProvider client={queryClient}>{children}</RQProvider>;
}