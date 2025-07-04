// tailwind.config.js (crear en la raíz del proyecto)
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    corePlugins: {
        preflight: false, // Evita que Tailwind resetee estilos de Material
    }
}