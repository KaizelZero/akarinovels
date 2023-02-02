import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import supabase from "@/utils/supabase";
import { useState, useEffect } from "react";

async function getNovels(profile) {
	const { data: novels, error } = await supabase
		.from("Library")
		.select(
			`
			novel_id,
			Novels (
				id, 
				title, 
				cover
			)
		`
		)
		.eq("username", profile);

	return novels;
}

export default function Profile() {
	const session = useSession();
	const router = useRouter();
	const profile = router.query.id;
	const [novels, setNovels] = useState([]);

	useEffect(() => {
		if (profile) {
			getNovels(profile).then((novels) => setNovels(novels));
		}
	}, [profile]);

	return (
		<>
			<div>Profile</div>
			<div>{profile}</div>
			{novels.map((novel) => (
				<div key={novel.novel_id}>
					<div>{novel.Novels.title}</div>
					<img src={novel.Novels.cover} />
				</div>
			))}
		</>
	);
}
