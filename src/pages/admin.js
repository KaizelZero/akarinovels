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
	useToast,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	Select,
} from "@chakra-ui/react";
import Head from "next/head";

export default function Admin() {
	const session = useSession();
	const router = useRouter();
	const [isAdmin, setIsAdmin] = useState();

	async function checkAdmin() {
		const { data, error } = await supabase
			.from("Users")
			.select("admin")
			.eq("id", session?.user.id)
			.single();

		if (data?.admin === false || !session) {
			setIsAdmin(false);
			router.push("/");
		} else {
			setIsAdmin(true);
		}
	}

	useEffect(() => {
		if (session) checkAdmin();
	}, [session]);

	return (
		<>
			<Head>
				<title>Admin</title>

				<meta name="description" content="Admin page" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div>
				{isAdmin && session ? (
					<>
						<h1>Admin page</h1>
						<CreateNovelForm />
						<CreateBookForm />
					</>
				) : (
					<p>Not admin</p>
				)}
			</div>
		</>
	);
}

function CreateNovelForm() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [cover, setCover] = useState("");
	const [author, setAuthor] = useState("");
	const toast = useToast();
	const router = useRouter();

	const createNovel = async (e) => {
		const { data, error } = await supabase.from("Novels").insert([
			{
				title: title,
				description: description,
				cover: cover,
				author: author,
			},
		]);

		if (!error) {
			toast({
				title: "Novel created.",
				description: "We've created your novel for you.",
				status: "success",
				duration: 9000,
				isClosable: true,
			});
			setTitle("");
			setDescription("");
			setCover("");
			setAuthor("");

			router.push("/admin");
		}
	};

	return (
		<div>
			<Center>
				<Box as="form" mt={4} className="w-2/3">
					<span className="mb-2 text-2xl font-bold">Add Novel</span>
					<FormControl>
						<FormLabel htmlFor="title">Title</FormLabel>
						<Input
							type="text"
							id="title"
							onChange={(e) => {
								setTitle(e.target.value);
							}}
						/>

						<FormLabel htmlFor="description">Description</FormLabel>
						<Input
							type="text"
							id="description"
							onChange={(e) => {
								setDescription(e.target.value);
							}}
						/>

						<FormLabel htmlFor="cover">Cover</FormLabel>
						<Input
							type="text"
							id="cover"
							onChange={(e) => {
								setCover(e.target.value);
							}}
						/>

						<FormLabel htmlFor="author">Author</FormLabel>
						<Input
							type="text"
							id="author"
							onChange={(e) => {
								setAuthor(e.target.value);
							}}
						/>

						<Button
							mt={4}
							onClick={() => {
								createNovel();
							}}
						>
							Submit
						</Button>
					</FormControl>
				</Box>
			</Center>
		</div>
	);
}

function CreateBookForm() {
	const [title, setTitle] = useState("");
	const [cover, setCover] = useState("");
	const [volume, setVolume] = useState("");
	const [novel, setNovel] = useState(0);
	const [novels, setNovels] = useState([]);
	const toast = useToast();
	const router = useRouter();

	const getNovels = async () => {
		const { data, error } = await supabase.from("Novels").select("id, title");

		if (!error) {
			setNovels(data);
		}
	};

	useEffect(() => {
		getNovels();
	}, []);

	const createBook = async (e) => {
		const { data, error } = await supabase.from("Books").insert([
			{
				novel_id: novel,
				title: title,
				cover: cover,
				volume: volume,
			},
		]);

		if (!error) {
			toast({
				title: "Book created.",
				description: "We've created your novel for you.",
				status: "success",
				duration: 9000,
				isClosable: true,
			});
			setNovel();
			setTitle("");
			setCover("");
			setVolume("");

			router.push("/admin");
		}
	};

	return (
		<div>
			<Center>
				<Box as="form" mt={4} className="w-2/3">
					<span className="mb-2 text-2xl font-bold">Add Book</span>
					<FormControl>
						<FormLabel htmlFor="title">Series Title</FormLabel>
						<Select
							placeholder="Select Series"
							onChange={(e) => {
								setNovel(Number(e.target.value));
							}}
						>
							{novels?.map((novel) => (
								<option key={novel.id} value={novel.id}>
									{novel.id} - {novel.title}
								</option>
							))}
						</Select>

						<FormLabel htmlFor="title">Title</FormLabel>
						<Input
							type="text"
							id="title"
							onChange={(e) => {
								setTitle(e.target.value);
							}}
						/>
						<FormLabel htmlFor="cover">Cover</FormLabel>
						<Input
							type="text"
							id="cover"
							onChange={(e) => {
								setCover(e.target.value);
							}}
						/>
						<FormLabel htmlFor="volume">Volume</FormLabel>
						<NumberInput
							max={100}
							min={0}
							defaultValue={0}
							onChange={(value) => {
								setVolume(value);
							}}
						>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>

						<Button
							mt={4}
							onClick={() => {
								createBook();
							}}
						>
							Submit
						</Button>
					</FormControl>
				</Box>
			</Center>
		</div>
	);
}
