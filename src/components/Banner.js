// takes in two strings
export default function Banner({ file, title }) {
	const backgroundImage = file;
	return (
		<div
			className="mb-8 h-bannerHeight"
			style={{
				backgroundImage: `url(${backgroundImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				backgroundAttachment: "fixed",
			}}
		>
			<div
				className=" flex h-full items-center justify-center text-center"
				style={{
					backgroundColor: "rgba(0, 0, 0, 0.65)",
				}}
			>
				<h1 className="select-none font-bold text-darkText min-[320px]:text-6xl sm:text-6xl md:text-6xl lg:text-8xl">
					{title}
				</h1>
			</div>
		</div>
	);
}
