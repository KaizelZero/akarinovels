import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Navbar from "./Navbar";
import { ChakraProvider } from "@chakra-ui/react";

export default function Layout({ children }) {
	const session = useSession();
	const supabase = useSupabaseClient();

	return (
		<ChakraProvider resetCSS>
			<Navbar />
			<main>{children}</main>
		</ChakraProvider>
	);
}
