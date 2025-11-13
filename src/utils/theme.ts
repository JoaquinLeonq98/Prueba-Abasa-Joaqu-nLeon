export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "preferred-theme";

export const getPreferredTheme = (): Theme => {
	if (typeof window === "undefined") return "light";
	const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
	if (stored === "dark" || stored === "light") {
		return stored;
	}
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const applyTheme = (theme: Theme) => {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	root.classList.toggle("dark", theme === "dark");
	root.setAttribute("data-theme", theme);
	window.localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const subscribeToSystemTheme = (callback: (theme: Theme) => void) => {
	if (typeof window === "undefined") return () => {};
	const media = window.matchMedia("(prefers-color-scheme: dark)");
	const handler = (event: MediaQueryListEvent) => callback(event.matches ? "dark" : "light");
	media.addEventListener("change", handler);
	return () => media.removeEventListener("change", handler);
};

export const themeInitScript = `(() => {
	try {
		const storageKey = '${THEME_STORAGE_KEY}';
		const stored = window.localStorage.getItem(storageKey);
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const theme = stored === 'dark' || stored === 'light' ? stored : prefersDark ? 'dark' : 'light';
		const root = document.documentElement;
		root.classList.toggle('dark', theme === 'dark');
		root.setAttribute('data-theme', theme);
		window.localStorage.setItem(storageKey, theme);
	} catch (error) {
		console.warn('No se pudo aplicar el tema preferido', error);
	}
})();`;

