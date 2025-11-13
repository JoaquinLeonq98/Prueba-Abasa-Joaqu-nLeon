const API_URL = "https://dummyjson.com/products?limit=100";
const PRODUCT_URL = "https://dummyjson.com/products";

export interface CatalogItem {
	id: number;
	slug: string;
	title: string;
	price: number;
	description: string;
	category: string;
	image: string;
	rating: {
		rate: number;
		count: number;
	};
}

interface RawItem {
	id			: number;
	title		: string;
	price		: number;
	description	: string;
	category	: string;
	thumbnail	: string;	
	images		: string[];
	rating		: number;
	stock		: number;
}

let cache: CatalogItem[] | null = null;

const mapItem = (item: RawItem): CatalogItem => ({
	id				: item.id,
	title			: item.title,
	description		: item.description,
	price			: item.price,
	category		: item.category,
	slug			: String(item.id),
	image			: item.thumbnail ?? item.images?.[0] ?? "",
	rating: {
		rate: item.rating ?? 0,
		count: item.stock ?? 0,
	},
});

export const fetchItems = async (): Promise<CatalogItem[]> => {
	if (cache) return cache;

	const response = await fetch(API_URL);
	if (!response.ok) {
		throw new Error(`Error fetching catalog data: ${response.statusText}`);
	}

	const { products } = (await response.json()) as { products: RawItem[] };
	cache = products.map(mapItem);
	return cache;
};

export const fetchItemBySlug = async (slug: string): Promise<CatalogItem | null> => {
	const id = Number(slug);

	if (!Number.isNaN(id)) {
		const response = await fetch(`${PRODUCT_URL}/${id}`);
		if (response.ok) {
			const product = (await response.json()) as RawItem;
			const mapped = mapItem(product);
			cache = cache ? [...cache.filter((item) => item.id !== mapped.id), mapped] : [mapped];
			return mapped;
		}
	}

	return null;
};

