import { useEffect, useState } from "react";
import { applyTheme, getPreferredTheme, subscribeToSystemTheme, type Theme } from "../../utils/theme";

const ThemeToggle = () => {
	const [theme, setTheme] = useState<Theme>("light");

	useEffect(() => {
		const preferred = getPreferredTheme();
		setTheme(preferred);
		applyTheme(preferred);

		const unsubscribe = subscribeToSystemTheme((systemTheme) => {
			setTheme(systemTheme);
			applyTheme(systemTheme);
		});

		return unsubscribe;
	}, []);

	const toggleTheme = () => {
		setTheme((prev) => {
			const next = prev === "dark" ? "light" : "dark";
			applyTheme(next);
			return next;
		});
	};

	return (
		<button
			type="button"
			onClick={toggleTheme}
			aria-label={`Cambiar a tema ${theme === "dark" ? "claro" : "oscuro"}`}
			className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:text-white dark:focus-visible:ring-slate-700/80"
		>
			{theme === "dark" ? (
				<>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
						<path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z" />
					</svg>
					Oscuro
				</>
			) : (
				<>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm0 4a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1zm0-18a1 1 0 0 1-1-1V2a1 1 0 0 1 2 0v1a1 1 0 0 1-1 1zm10 7h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2zm-18 0H3a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2zm14.95 8.536-.707-.707a1 1 0 1 1 1.414-1.414l.707.707a1 1 0 1 1-1.414 1.414zM6.343 6.343l-.707-.707A1 1 0 1 1 7.05 4.222l.707.707A1 1 0 0 1 6.343 6.343zm12.02-2.121a1 1 0 0 1 1.414 0l.707.707a1 1 0 1 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414zM5.636 18.364a1 1 0 0 1 0-1.414l.707-.707a1 1 0 1 1 1.414 1.414l-.707.707a1 1 0 0 1-1.414 0z" />
					</svg>
					Claro
				</>
			)}
		</button>
	);
};

export default ThemeToggle;

