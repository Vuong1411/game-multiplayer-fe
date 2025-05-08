const colors = [
    '#4A90E2', // Vivid blue
    '#50C878', // Emerald green
    '#9B59B6', // Amethyst purple
    '#E74C3C', // Bright red
    '#2980B9', // Ocean blue
    '#16A085', // Green sea
    '#8E44AD', // Wisteria purple
    '#E67E22'  // Carrot orange
];

export const getColor = (index: number): string => {
    return colors[index % colors.length];
};

export const getColorPalette = (): readonly string[] => {
    return colors;
};