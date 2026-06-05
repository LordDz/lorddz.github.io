import { awesomeWordCategories } from "#/data/awesome-word/categories";
import type { CategoryId } from "#/data/awesome-word/types";

type CategoryPickerProps = {
	onSelect: (categoryId: CategoryId) => void;
};

export default function CategoryPicker({ onSelect }: CategoryPickerProps) {
	return (
		<div className="awesome-word-categories">
			{awesomeWordCategories.map((category) => (
				<button
					key={category.id}
					type="button"
					className="awesome-word-category-btn"
					onClick={() => onSelect(category.id)}
				>
					<img src={category.imageUrl} alt="" />
					<span className="awesome-word-category-label">{category.name}</span>
					<p className="awesome-word-category-desc">{category.description}</p>
				</button>
			))}
		</div>
	);
}
