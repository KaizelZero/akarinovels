import React, { useEffect, useState, useRef } from "react";
import {
	Input,
	InputGroup,
	InputRightElement,
	IconButton,
	FormControl,
	Box,
	Spinner,
	Text,
	VStack,
	List,
} from "@chakra-ui/react";
import supabase from "@/utils/supabase";
import { HiSearch } from "react-icons/hi";
import Link from "next/link";
import { useDisclosure } from "@chakra-ui/hooks";
import { useRouter } from "next/router";

const debounce = (func, wait) => {
	let timeout;
	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
};

export default function Search() {
	const [search, setSearch] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const { isOpen, onToggle, onClose } = useDisclosure();
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const dropdownRef = useRef();

	const router = useRouter();

	const handleSearch = debounce(async (search) => {
		setLoading(true);

		try {
			const { data, error } = await supabase
				.from("Novels")
				.select()
				.textSearch("title", `'${search}'`);
			setResults(data);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}, 1000);

	useEffect(() => {
		handleSearch(search);
	}, [search]);

	const handleKeyDown = (e) => {
		if (!dropdownRef.current || !results?.length) return;

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setSelectedIndex((selectedIndex + 1) % results.length);
				break;
			case "ArrowUp":
				e.preventDefault();
				setSelectedIndex((selectedIndex - 1 + results.length) % results.length);
				break;
			case "Enter":
				router.push(`/novels/${results[selectedIndex].id}`);
				onClose();
				document.getElementById("searchBar").blur();
				setSearch("");
				break;
			default:
				break;
		}
	};

	return (
		<div>
			<VStack>
				<InputGroup onBlur={onClose}>
					<Input
						id="searchBar"
						variant="filled"
						placeholder="Search"
						onChange={(e) => setSearch(e.target.value)}
						value={search}
						width="20rem"
						onFocus={onToggle}
						onKeyDown={handleKeyDown}
					/>
					<InputRightElement>
						{search.length > 0 && loading ? (
							<Spinner size="sm" />
						) : (
							<IconButton
								aria-label="Search"
								icon={<HiSearch />}
								onClick={() => {
									router.push(`/search?query=${search}`);
									onClose();
									setSearch("");
								}}
							/>
						)}
					</InputRightElement>
				</InputGroup>
				{isOpen && (
					<Box
						position="absolute"
						w={"20rem"}
						top="65%"
						bg="gray.800"
						border="1px"
						borderRadius="md"
						shadow="md"
						zIndex="10"
						ref={dropdownRef}
					>
						{results?.length > 0 ? (
							<List>
								{results.map((result) => (
									<li
										key={result.id}
										onMouseDown={(e) => {
											e.preventDefault();
											router.push(`/novels/${result.id}`);
											onClose();
											document.getElementById("searchBar").blur();
											setSearch("");
										}}
										className={`cursor-pointer truncate p-2 hover:bg-gray-700 ${
											selectedIndex === results.indexOf(result)
												? "bg-gray-700"
												: ""
										}`}
									>
										{result.title}
									</li>
								))}
							</List>
						) : (
							<Text p="2">No results found</Text>
						)}
					</Box>
				)}
			</VStack>
		</div>
	);
}
