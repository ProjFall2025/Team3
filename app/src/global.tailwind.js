export const GLOBAL_TAILWIND_THEMES = {
    light: {
        fluidContainer: "p-4 bg-white rounded shadow-lg w-[calc(100%-2rem)] max-w-2xl mx-auto mt-[1rem] ",
        flexCenter: "flex flex-col items-center justify-center ",
        form: "flex flex-col gap-4 items-center justify-center w-full max-w-md ",
        buttonPrimary: "bg-blue-500 shadow-md shadow-blue-500/50 text-white p-2 rounded hover:bg-blue-600 w-full max-w-md ",
        button: {
            primary: "bg-blue-500 shadow-md shadow-blue-500/50 text-white p-2 rounded hover:bg-blue-600 w-full max-w-md transition ",
            secondary: "bg-gray-800 shadow-md shadow-stone-800/50 text-white p-2 rounded hover:bg-black w-full max-w-md transition ",
            inactive: "bg-gray-300 shadow-none text-gray-700 cursor-not-allowed pointer-events-none"
        },
        inputField: "border border-gray-300 p-2 rounded w-full max-w-md ",
        card: "bg-white shadow-md rounded p-4 ",
        header: "text-4xl font-bold mb-4 ",
        errorMessage: "mt-[-18px] self-start text-red-500 ",
        smoothTransition: "transition duration-300 ease-in-out ",
        collapseHeight: "max-h-0 overflow-hidden ",
        unstyledLink: "text-inherit no-underline ",
        paragraph: "text-gray-700 ",
    },
    dark: {
        fluidContainer: "p-4 bg-gray-800 rounded shadow-lg w-[calc(100%-2rem)] max-w-2xl mx-auto mt-[1rem] ",
        flexCenter: "flex flex-col items-center justify-center ",
        form: "flex flex-col gap-4 items-center justify-center w-full max-w-md ",
        buttonPrimary: "bg-blue-700 shadow-md shadow-blue-700/50 text-white p-2 rounded hover:bg-blue-800 w-full max-w-md ",
        button: {
            primary: "bg-blue-700 shadow-md shadow-blue-700/50 text-white p-2 rounded hover:bg-blue-800 w-full max-w-md transition ",
            secondary: "bg-gray-700 shadow-md shadow-gray-700/50 text-white p-2 rounded hover:bg-gray-800 w-full max-w-md transition ",
            inactive: "bg-gray-500 shadow-none text-gray-300 cursor-not-allowed pointer-events-none"
        },
        inputField: "border border-gray-600 p-2 rounded w-full max-w-md ",
        card: "bg-gray-700 shadow-md rounded p-4 ",
        header: "text-4xl font-bold mb-4 text-white ",
        errorMessage: "mt-[-18px] self-start text-red-400 ",
        smoothTransition: "transition duration-300 ease-in-out ",
        collapseHeight: "max-h-0 overflow-hidden ",
        unstyledLink: "text-inherit no-underline ",
        paragraph: "text-gray-300 ",
    }
};

export const GLOBAL_TAILWIND = {
    current_theme: "light",
    themes: GLOBAL_TAILWIND_THEMES
}
    