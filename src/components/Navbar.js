import Link from "next/link";
import Image from "next/image";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import {
	Flex,
	useColorMode,
	useColorModeValue,
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuGroup,
	MenuItem,
	MenuDivider,
	Avatar,
} from "@chakra-ui/react";

function Navbar() {
	const supabase = useSupabaseClient();
	const session = useSession();
	const { colorMode, toggleColorMode } = useColorMode();
	const lineColor = useColorModeValue("black", "#EAEAEA");

	async function signInWithDiscord() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "discord",
		});
	}

	function signOut() {
		supabase.auth.signOut();
	}

	supabase.auth.onAuthStateChange(async (event, session) => {
		if (event === "SIGNED_IN") {
			const { data, error } = await supabase
				.from("Users")
				.select("id")
				.eq("id", session.user.id);

			if (data.length === 0) {
				const { data, error } = await supabase.from("Users").insert([
					{
						id: session.user.id,
						name: session.user.user_metadata.name,
					},
				]);
			}
		}
	});

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
			bg={useColorModeValue("white", "gray.800")}
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
				<Button colorScheme="teal" onClick={toggleColorMode} className="mr-6">
					Button
				</Button>
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
								size="md"
							/>
							<MenuList>
								<MenuItem>{session.user.user_metadata.name}</MenuItem>
								<MenuItem>Novel List</MenuItem>
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
