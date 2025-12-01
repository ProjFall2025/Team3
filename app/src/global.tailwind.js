export const GLOBAL_TAILWIND_THEMES = {
    light: {
        fluidContainer: "p-4 bg-white rounded shadow-lg w-[calc(100%-2rem)] max-w-2xl mx-auto mt-[1rem] ",
        wideContainer: "p-4 bg-grey rounded w-full max-w mx-auto mt-[1rem] ",
        gridContainer: "grid grid-cols-1 md:grid-cols-5 gap-2 w-full ",
        flexCenter: "flex flex-col items-center justify-center ",
        form: "flex flex-col gap-4 items-center justify-center w-full max-w-md ",
        buttonPrimary: "bg-blue-500 shadow-md shadow-blue-500/50 text-white p-2 rounded hover:bg-blue-600 w-full max-w-md ",
        buttonMiddle: "bg-blue-500 shadow-md shadow-blue-500/50 text-white p-2 rounded hover:bg-blue-600 w-48 ",
        buttonSlim: "bg-blue-500 shadow-md shadow-blue-500/50 text-white p-2 rounded hover:bg-blue-600 w-28 h-8 flex items-center justify-center",
        buttonInvisible: "visibility: invisible bg-blue-500 shadow-md shadow-blue-500/50 text-white p-2 rounded hover:bg-blue-600 w-28 h-8 flex items-center justify-center",
        buttonInactive: "bg-gray-300 shadow-none text-gray-700 cursor-not-allowed pointer-events-none p-2 rounded w-28 h-8 flex items-center justify-center",
        button: {
            primary: "bg-blue-500 shadow-md shadow-blue-500/50 text-white p-2 rounded hover:bg-blue-600 w-full max-w-md transition ",
            secondary: "bg-gray-800 shadow-md shadow-stone-800/50 text-white p-2 rounded hover:bg-black w-full max-w-md transition ",
            inactive: "bg-gray-300 shadow-none text-gray-700 cursor-not-allowed pointer-events-none"
        },
        inputField: "border border-gray-300 p-2 rounded w-full max-w-md ",
        inputFieldWide: "readOnly={false} border border-gray-300 p-2 rounded w-100 max-w-md ",
        inputFieldNotEditable: "readOnly={true} bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300 p-2 rounded w-100 max-w-md ",
        card: "bg-white shadow-md rounded p-4 ",
        header: "text-4xl font-bold mb-4 ",
        smallHeader: "text-2xl font-bold mb-4 ",
        errorMessage: "mt-[-18px] self-start text-red-500 ",
        smoothTransition: "transition duration-300 ease-in-out ",
        collapseHeight: "max-h-0 overflow-hidden ",
        unstyledLink: "text-inherit no-underline ",
        paragraph: "text-gray-700 ",
        textarea: "readOnly={false} resize-none border border-gray-300 p-2 rounded w-100 max-w-md ",
        textareaNotEditable: "readOnly={true} bg-gray-200 text-gray-500 cursor-not-allowed resize-none border border-gray-300 p-2 rounded w-100 max-w-md ",
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
    