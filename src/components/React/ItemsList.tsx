import { useCallback, useEffect, useMemo, useState } from "react";
import type { CatalogItem } from "../../lib/api";

interface ItemsListProps {
	items: CatalogItem[];
	initialPage?: number;
	pageSize?: number;
}

const formatter = new Intl.NumberFormat("es-ES", {
	style: "currency",
	currency: "USD",
});

const DEFAULT_PAGE_SIZE = 12;

const ItemsList = ({ items, initialPage = 1, pageSize = DEFAULT_PAGE_SIZE }: ItemsListProps) => {
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("all");
	const [page, setPage] = useState(initialPage);
	const [basePath, setBasePath] = useState("/");
	const [baseSearch, setBaseSearch] = useState("");

	const categories = useMemo(() => {
		const unique = new Set(items.map((item) => item.category));
		return ["all", ...Array.from(unique)];
	}, [items]);

	const filteredItems = useMemo(() => {
		const text = query.trim().toLowerCase();
		return items.filter((item) => {
			const matchesCategory = category === "all" || item.category === category;
			const matchesQuery =
				text.length === 0 ||
				item.title.toLowerCase().includes(text) ||
				item.description.toLowerCase().includes(text) ||
				item.category.toLowerCase().includes(text);
			return matchesCategory && matchesQuery;
		});
	}, [items, query, category]);

	const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));

	useEffect(() => {
		setPage(1);
	}, [query, category]);

	useEffect(() => {
		setPage(initialPage);
	}, [initialPage]);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const url = new URL(window.location.href);
		url.searchParams.delete("page");
		setBasePath(url.pathname);
		setBaseSearch(url.searchParams.toString());
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const url = new URL(window.location.href);
		if (page <= 1) {
			url.searchParams.delete("page");
		} else {
			url.searchParams.set("page", String(page));
		}
		window.history.replaceState({}, "", url);
	}, [page]);

	useEffect(() => {
		setPage((prev) => Math.min(prev, totalPages));
	}, [totalPages]);

	const createPageHref = useCallback(
		(target: number) => {
			const params = new URLSearchParams(baseSearch);
			if (target <= 1) {
				params.delete("page");
			} else {
				params.set("page", String(target));
			}
			const queryString = params.toString();
			return `${basePath}${queryString ? `?${queryString}` : ""}`;
		},
		[basePath, baseSearch],
	);

	const pageNumbers = useMemo(
		() => Array.from({ length: totalPages }, (_, index) => index + 1),
		[totalPages],
	);

	const paginatedItems = useMemo(() => {
		const start = (page - 1) * pageSize;
		return filteredItems.slice(start, start + pageSize);
	}, [filteredItems, page, pageSize]);

	return (
		<section className="flex flex-col gap-10">
			<div className="flex flex-col gap-6 rounded-xl border border-slate-200/60 bg-white/90 p-6 shadow-[0_16px_40px_rgba(52,52,53,0.06)] backdrop-blur supports-backdrop-filter:bg-white/70 dark:border-slate-700/70 dark:bg-slate-900/80 dark:shadow-[0_20px_50px_rgba(2,6,23,0.65)]">
				<header className="flex flex-col gap-2">
					<h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
						Explora el catálogo
					</h2>
					<p className="text-sm text-slate-500 dark:text-slate-300">
						Filtra por categoría o busca por palabras clave para localizar productos rápidamente.
					</p>
				</header>
				<div className="flex flex-col gap-4 md:flex-row md:items-end">
					<label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-900 dark:text-white">
						Búsqueda
						<input
							type="search"
							className="w-full rounded-lg border border-slate-200 bg-white/95 px-4 py-2 text-base text-slate-900 shadow-inner placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/55 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700/60"
							placeholder="Nombre, categoría o descripción"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
						/>
					</label>
					<label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-900 dark:text-white md:max-w-xs">
						Categoría
						<select
							className="w-full rounded-lg border border-slate-200 bg-white/95 px-4 py-2 text-base text-slate-900 shadow-inner focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/55 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700/60"
							value={category}
							onChange={(event) => setCategory(event.target.value)}
						>
							{categories.map((option) => (
								<option key={option} value={option}>
									{option === "all" ? "Todas las categorías" : option}
								</option>
							))}
						</select>
					</label>
				</div>
				<p className="text-sm text-slate-500 dark:text-slate-300">
					Resultados: {filteredItems.length} de {items.length} productos.
				</p>
			</div>

			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{paginatedItems.map((item) => (
					<a
						key={item.slug}
						href={`/item/${item.slug}`}
						className="group flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-slate-200/60 bg-white/90 p-5 shadow-[0_16px_40px_rgba(52,52,53,0.06)] transition hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-200 focus-visible:ring-offset-2 dark:border-slate-700/60 dark:bg-slate-900/80 dark:shadow-[0_20px_50px_rgba(2,6,23,0.65)] dark:focus-visible:ring-slate-700"
					>
						<div className="relative flex aspect-square items-center justify-center rounded-lg bg-slate-100/90 p-6 dark:bg-slate-900/70">
							<img
								src={item.image}
								alt={`Imagen de ${item.title}`}
								className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
								loading="lazy"
							/>
						</div>
						<div className="flex flex-1 flex-col gap-3 pt-5">
							<div className="flex items-center justify-between gap-2 text-sm">
								<span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
									{item.category}
								</span>
								<span className="font-semibold text-slate-900 dark:text-slate-100">
									{formatter.format(item.price)}
								</span>
							</div>
							<h3 className="text-base font-semibold text-slate-900 transition-colors group-hover:text-slate-600 dark:text-slate-100 dark:group-hover:text-slate-300">
								{item.title}
							</h3>
							<p className="text-sm text-slate-500 dark:text-slate-300">
								{item.description}
							</p>
							<div className="mt-auto flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400">
								<span className="inline-flex items-center gap-1">
									<svg
										className="h-4 w-4 text-amber-400"
										viewBox="0 0 24 24"
										fill="currentColor"
										aria-hidden="true"
									>
										<path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
									</svg>
									{item.rating.rate.toFixed(1)}
								</span>
								<span>
									{item.rating.count > 0 ? `${item.rating.count} disponibles` : "Sin dato de stock"}
								</span>
							</div>
						</div>
					</a>
				))}
				{filteredItems.length === 0 && (
					<div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white/90 p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
						<h3 className="text-lg font-semibold">No encontramos resultados</h3>
						<p className="max-w-md text-sm">
							Intenta cambiar los filtros o buscar otro término. El catálogo se actualiza
							constantemente.
						</p>
					</div>
				)}
			</div>

			{filteredItems.length > 0 && (
				<nav className="flex flex-col gap-4 rounded-xl border border-slate-200/60 bg-white/90 p-4 text-sm text-slate-500 shadow-[0_16px_40px_rgba(52,52,53,0.06)] sm:flex-row sm:items-center sm:justify-between dark:border-slate-700/60 dark:bg-slate-900/80 dark:text-slate-300 dark:shadow-[0_20px_50px_rgba(2,6,23,0.65)]">
					<div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
						<span className="hidden sm:inline">Página {page} de {totalPages}</span>
						<a
							href={createPageHref(Math.max(1, page - 1))}
							aria-disabled={page === 1}
							className="inline-flex h-9 min-w-[88px] items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-white hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-200 aria-disabled:pointer-events-none aria-disabled:opacity-40 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-900 dark:hover:text-white dark:focus-visible:ring-slate-700"
						>
							Anterior
						</a>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						{pageNumbers.map((pageNumber) => {
							const isActive = pageNumber === page;
							return (
								<a
									key={pageNumber}
									href={createPageHref(pageNumber)}
									aria-current={isActive ? "page" : undefined}
									className={[
										"inline-flex h-9 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-200",
										isActive
									? "border-slate-900 bg-white text-slate-900 shadow-sm dark:border-white dark:bg-white dark:text-slate-900"
									: "border-slate-200 bg-white/95 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-900 dark:hover:text-white",
									].join(" ")}
								>
									{pageNumber}
								</a>
							);
						})}
					</div>
					<div className="flex items-center justify-end gap-2 text-slate-600 dark:text-slate-300">
						<a
							href={createPageHref(Math.min(totalPages, page + 1))}
							aria-disabled={page === totalPages}
							className="inline-flex h-9 min-w-[88px] items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-200 aria-disabled:pointer-events-none aria-disabled:opacity-40 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-900 dark:hover:text-white dark:focus-visible:ring-slate-700"
						>
							Siguiente
						</a>
					</div>
				</nav>
			)}
		</section>
	);
};

export default ItemsList;

