import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark")
        } else if (theme === "dark") {
            setTheme("light")
        } else {
            // If it's system, toggle based on current active state
            const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            setTheme(isSystemDark ? "light" : "dark")
        }
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 w-10 h-10 rounded-full bg-secondary/80 flex items-center justify-center hover:bg-secondary border border-border transition-all text-foreground glow-border"
            aria-label="Toggle theme"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
