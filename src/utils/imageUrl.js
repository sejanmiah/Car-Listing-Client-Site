
// Helper function to get the full image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath; // Already absolute
    return `http://localhost:5000${imagePath}`; // Prepend backend URL
};
