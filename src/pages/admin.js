// Protected route
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "@/utils/supabase";
import {
	Box,
	Button,
	Center,
	FormControl,
	FormLabel,
	Input,
} from "@chakra-ui/react";
import Head from "next/head";

export default function Admin() {
	const session = useSession();
	const router = useRouter();
	const [isAdmin, setIsAdmin] = useState(false);

	async function checkAdmin() {
		const { data, error } = await supabase
			.from("Users")
			.select("admin")
			.eq("id", session?.user.id)
			.single();

		if (data?.admin === false || !session) {
			router.push("/");
		} else {
			setIsAdmin(true);
		}
	}

	useEffect(() => {
		checkAdmin();
	}, [session]);

	return (
		<>
			<Head>
				<title>Admin</title>

				<meta name="description" content="Admin page" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div>
				{isAdmin ? (
					<div>
						<h1>Admin page</h1>
						<Center>
							<Box as="form" mt={4} className="w-2/3">
								<FormControl>
									<FormLabel htmlFor="title">Title</FormLabel>
									<Input type="text" id="title" />

									<FormLabel htmlFor="description">Description</FormLabel>
									<Input type="text" id="description" />

									<FormLabel htmlFor="cover">Cover</FormLabel>
									<Input type="text" id="cover" />

									<FormLabel htmlFor="author">Author</FormLabel>
									<Input type="text" id="author" />

									<Button type="submit" mt={4}>
										Submit
									</Button>
								</FormControl>
							</Box>
						</Center>
					</div>
				) : (
					<p>Not admin</p>
				)}
			</div>
		</>
	);
}
