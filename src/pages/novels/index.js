import supabase from "@/utils/supabase";
import { Box, SimpleGrid } from "@chakra-ui/react";
import Link from "next/link";

export async function getServerSideProps() {
	const { data, error } = await supabase.from("Novels").select("*");

	return {
		props: {
			novels: data,
		},
	};
}

export default function Novels({ novels }) {
	// const supabase = useSupabaseClient();

	return (
		<div
			className="
			flex min-h-screen flex-col items-center
			"
		>
			{/* <SimpleGrid minChildWidth="120px" spacing="40px"> */}
			<SimpleGrid
				columns={[2, 3, 4, 5, 6]}
				spacingX="2rem"
				spacingY="3rem"
				overflow="hidden"
			>
				{novels.map((novel) => (
					<Link href={`/novels/${novel.id}`} key={novel.id}>
						<Box
							height="100%"
							width={{
								base: "200px",
							}}
							key={novel.id}
							className="
						hover:text-slate-500
						"
						>
							<img
								src={novel.cover}
								alt={novel.title}
								width="286px"
								height="400px"
								className="
							rounded-lg
							shadow-lg
							hover:border-2 hover:border-black hover:opacity-80
							"
							/>
							<p className="mx-2 mt-1 line-clamp-2">{novel.title}</p>
						</Box>
					</Link>
				))}
			</SimpleGrid>
		</div>
	);
}
