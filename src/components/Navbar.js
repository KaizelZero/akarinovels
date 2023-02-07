import Link from "next/link";
import Image from "next/image";
import { useSession } from "@supabase/auth-helpers-react";
import supabase from "@/utils/supabase";
import { useState, useEffect } from "react";
import {
	Flex,
	useColorMode,
	useColorModeValue,
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Avatar,
} from "@chakra-ui/react";
import Search from "./Search";

function Navbar() {
	const session = useSession();
	const lineColor = useColorModeValue("black", "#EAEAEA");
	const [isAdmin, setIsAdmin] = useState(false);

	async function signInWithDiscord() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "discord",
		});
	}

	function signOut() {
		supabase.auth.signOut();
	}

	useEffect(() => {
		async function addUser() {
			const { data, error } = await supabase
				.from("Users")
				.select("id, admin")
				.eq("id", session?.user.id)
				.single();

			if (data?.admin === true) {
				setIsAdmin(true);
			}

			if (!data) {
				const { data, error } = await supabase.from("Users").insert([
					{
						id: session.user.id,
						name: session.user.user_metadata.name,
						avatar: session.user.user_metadata.picture,
					},
				]);
			} else {
				const { data: updatedUser, error: updateError } = await supabase
					.from("Users")
					.update({
						name: session.user.user_metadata.name,
						avatar: session.user.user_metadata.picture,
					})
					.eq("id", session.user.id);
			}

			if (error) {
				console.log(error);
			}
		}
		if (session) {
			addUser();
		}
	}, [session]);

	return (
		<Flex
			as={"nav"}
			align={"center"}
			justify={"space-between"}
			wrap={"wrap"}
			w={"100%"}
			height={"5rem"}
			p={15}
			position={"sticky"}
			top={0}
			zIndex={1}
			borderBottom={`1px solid ${lineColor}`}
			bg={useColorModeValue("gray.800", "gray.800")}
		>
			<Flex align={"center"} mr={5}>
				{/* <Image src={"/favicon.ico"} alt={"logo"} width={50} height={50} /> */}
				<div>
					<Link href={"/"}>
						<span className={"ml-2 text-2xl font-bold"}>Akari Novels</span>
					</Link>
				</div>
			</Flex>

			<Flex align={"center"}>
				<Search />
			</Flex>

			<Flex align={"center"}>
				<Link href={"/novels"}>
					<Button colorScheme="teal" variant="outline" className="mr-6">
						Novels
					</Button>
				</Link>
				{session ? (
					<>
						<Menu>
							<MenuButton
								as={Avatar}
								colorScheme="pink"
								src={session.user.user_metadata.picture}
								name={session.user.user_metadata.name}
								size="md"
							/>
							<MenuList>
								<Link
									href={{
										pathname: "/profile",
										query: { id: session.user.user_metadata.name },
									}}
								>
									<MenuItem>{session.user.user_metadata.name}</MenuItem>
								</Link>
								{isAdmin ? (
									<Link href={"/admin"}>
										<MenuItem>Admin</MenuItem>
									</Link>
								) : null}
								<MenuItem onClick={signOut}>Logout</MenuItem>
							</MenuList>
						</Menu>
					</>
				) : (
					// <Link href={"/login"}>
					<Button
						colorScheme="teal"
						variant="ghost"
						className="mr-2"
						onClick={signInWithDiscord}
					>
						Login
					</Button>
					// </Link>
				)}
			</Flex>
		</Flex>
	);
}

export default Navbar;
