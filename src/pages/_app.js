import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
	const [supabaseClient] = useState(() => createBrowserSupabaseClient());

	return (
		<SessionContextProvider
			supabaseClient={supabaseClient}
			initialSession={pageProps.initialSession}
		>
			<Layout>
				<ChakraProvider>
					<Component {...pageProps} />
				</ChakraProvider>
			</Layout>
		</SessionContextProvider>
	);
}

export default MyApp;
