import { Internal } from "@/Controllers/Storage";
const links = [
    { path: "/", name: "Home" },
    { path: "/terms", name: "Terms" },
]
export function PartialsHeader() {
    return `
    <header class="text-white p-2 transition-transform bg-gray-200 dark:bg-slate-900 duration-300">
        <div class="container mx-auto flex items-center justify-between">
            <div class="flex items-center">
                <a href="/">
                    <img class="w-16 h-16 rounded-full" src="${Internal.get("core:logo")}" alt="Logo">
                </a>
                <a href="/">
                    <h1 class="text-2xl font-bold text-black dark:text-white hover:text-gray-300 dark:hover:text-gray-700 duration-300 ml-2">
                    ${Internal.get("core:title")}
                </h1>
                </a>
                <!-- Toggle Theme -->
                <button class="ml-6 w-20 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center transition duration-300 focus:outline-none shadow" onclick="toggleTheme()">
                <div id="switch-toggle" class="w-10 h-10 relative rounded-full transition duration-500 transform bg-yellow-500 -translate-x-2 p-1 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                </button>
                <!-- Toggle Theme -->
            </div>
            
            <div class="font-semibold items-center flex-row md:flex">
                <div class="hidden md:flex">
                    <!-- Desktop -->
                    ${links.map((link) => `<a href="${link.path}" class="nav-link text-black dark:text-white hover:text-gray-300 dark:hover:text-gray-700 ml-4 duration-300">${link.name}</a>`).join('')}
                </div>
                <div class="block md:hidden">
                    <!-- Mobile Button -->
                    <button class="duration-300 text-white bg-blue-700 hover:bg-blue-800 font-bold rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center" type="button" data-dropdown-toggle="dropdown">
                        Menu
                    </button>
                </div>
                <div class="duration-300 hidden dark:bg-slate-800 bg-gray-800  text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4" id="dropdown">
                    <div class="block md:hidden">
                        <!-- Mobile More Links -->
                        ${links.map((link) => `<a href="${link.path}" class="nav-link-mobile flex space-x-2 items-center px-4 py-2 w-full text-left hover:bg-gray-600 duration-300">${link.name}</a>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    </header>
    <script>
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
    function highlightCurrentRoute() {
        const currentPath = window.location.pathname;
        const applyClasses = (link, classes) => link.classList.add(...classes);
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            const isActive = currentPath === linkPath;
            const lightThemeClasses = ['text-black', 'hover:text-gray-300'];
            const darkThemeClasses = ['dark:text-white', 'dark:hover:text-gray-700', 'dark:border-blue-400'];
            const blueThemeClasses = ['text-blue-600', 'hover:text-blue-300'];
            const blueDarkThemeClasses = ['dark:text-blue-400', 'dark:hover:text-blue-600', 'dark:border-blue-400'];
            link.classList.remove(...lightThemeClasses, ...darkThemeClasses, ...blueThemeClasses, ...blueDarkThemeClasses);
            if (isActive) {
                link.classList.add(...blueThemeClasses, ...blueDarkThemeClasses);
            } else {
                link.classList.add(...lightThemeClasses, ...darkThemeClasses);
            }
        });
    }
    document.addEventListener('DOMContentLoaded', function () {
        highlightCurrentRoute()
    })
    </script>
`
}