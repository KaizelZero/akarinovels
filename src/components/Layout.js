import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Layout({ children }) {
	const session = useSession();
	const supabase = useSupabaseClient();

	return (
		<div>
			<main>{children}</main>
		</div>
	);
}
