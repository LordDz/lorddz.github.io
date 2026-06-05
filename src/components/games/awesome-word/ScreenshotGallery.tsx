import { useStore } from "@tanstack/react-store";

import { awesomeWordStore } from "#/stores/awesomeWordStore";

export default function ScreenshotGallery() {
	const { screenshots } = useStore(awesomeWordStore);

	if (screenshots.length === 0) return null;

	return (
		<section className="awesome-word-gallery">
			<h3>Round history</h3>
			<div className="awesome-word-gallery-grid">
				{screenshots.map((shot) => (
					<button
						key={shot.id}
						type="button"
						className="awesome-word-gallery-thumb"
						title={`${shot.won ? "Won" : "Lost"}: ${shot.word}`}
						onClick={() => {
							const win = window.open("");
							if (win) {
								win.document.write(
									`<img src="${shot.dataUrl}" alt="AwesomeWord round" style="max-width:100%" />`,
								);
							}
						}}
					>
						<img src={shot.dataUrl} alt="" />
					</button>
				))}
			</div>
		</section>
	);
}
