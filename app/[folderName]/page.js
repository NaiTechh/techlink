"use client";
import { useState, useEffect } from "react";
import client from "@/app/utils/sanity";
import { usePathname } from "next/navigation";
import imageUrlBuilder from "@sanity/image-url";

export default function Folder({}) {
	const folderName = usePathname().replace("/", "");
	const [folderData, setFolderData] = useState(null);
	const [newtime, setNewtime] = useState(0);
	const builder = imageUrlBuilder(client);

	function urlForImage(source) {
		return builder.image(source);
	}

	useEffect(() => {
		if (folderName) {
			const fetchFolderData = async () => {
				const result = await client.fetch(
					`*[_type == "folder" && slug.current == "${folderName}"]{_id, title, description, image, links[]->{_id, title, url,image}}`
				);
				setFolderData(result[0]);
			};

			fetchFolderData();
		}
	}, []);

	if (!folderData) {
		return (
			<main
				className="min-h-screen p-2 md:p-5 bg-naitechh-surface"
				key="loading-placeholder"
			>
				<div className=" bg-purple-500 p-10 min-h-[98vh] rounded-xl border-4 md:border-8 border-black text-black flex flex-col justify-center items-center	">
					<h1 className=" font-bold text-4xl md:text-6xl border-4 lg:border-8 border-black rounded-xl p-6 tracking-wide">
						Waiting For The Page to Load!
					</h1>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen p-2 md:p-5 bg-naitechh-surface">
			<div className=" bg-naitechh-violet p-10 min-h-[98vh] rounded-xl border-4 md:border-8 border-black text-black flex flex-col justify-center items-center	">
				<h1 className="animate-fade-right animate-once animate-ease-in-out animate-normal text-center font-bold text-4xl md:text-6xl border-4 lg:border-8 border-black rounded-xl p-6 tracking-wide">
					Few Links on {folderData.title}
				</h1>

				{folderData.image && (
					<img
						src={urlForImage(folderData.image)}
						alt={folderData.title}
						className="md:max-w-[75ch] w-full rounded-lg max-h-[45vw] md:max-h-[15vw] object-cover mx-auto shadow-2xl border-8 border-naitechh-surface m-8 animate-fade-right animate-once animate-ease-in-out animate-normal"
					/>
				)}

				<div className=" md:-mt-20 mb-10 border-8 border-black bg-naitechh-surface rounded-xl p-3 md:p-7 text-center font-bold text-xl md:text-2xl min-w-[60vw] md:min-w-[22rem] min-h-full md:drop-shadow-[16px_16px_0px_#ed7f07] drop-shadow-[8px_8px_0px_#ed7f07] animate-fade-right animate-once animate-ease-in-out animate-normal max-w-lg">
					<p>{folderData.description}</p>
				</div>

				<ul>
					{folderData.links.map((link, index) => {
						return (
							<li
								key={link._id}
								className="animate-fade-right animate-once animate-ease-in-out animate-normal"
								style={{
									animationDelay: `${index + 1 * 0.3}s`,
								}} // Add staggered delay
							>
								<a
									href={link.url}
									class="relative font-bold text-lg md:font-semibold text-lg w-fit block after:block after:content-[''] after:absolute after:h-[3px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left hover:text-slate-700 pb-2 border-b-4 hover:border-0"
								>
									{link.title} ↗
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		</main>
	);
}
