/**
 * Avatar Generator Utility
 * Generates profile pictures from user initials
 */

class AvatarGenerator {
    constructor() {
        this.colors = [
            '#0ea5e9', // Blue
            '#6366f1', // Indigo
            '#8b5cf6', // Violet
            '#ec4899', // Pink
            '#ef4444', // Red
            '#f59e0b', // Amber
            '#10b981', // Emerald
            '#14b8a6'  // Teal
        ];
    }

    /**
     * Generate a canvas with user initials
     * @param {string} name - User's name
     * @param {number} size - Size of the avatar in pixels
     * @returns {HTMLCanvasElement} - Canvas element with the avatar
     */
    generateCanvas(name, size = 200) {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext('2d');

        // Get initials
        const initials = this.getInitials(name);
        
        // Get deterministic color based on name
        const colorIndex = this.getHashCode(name) % this.colors.length;
        const color = this.colors[colorIndex];
        
        // Draw background
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw text
        context.fillStyle = 'white';
        context.font = `bold ${size / 2}px Inter, sans-serif`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(initials, size / 2, size / 2);
        
        return canvas;
    }
    
    /**
     * Generate a data URL for an avatar
     * @param {string} name - User's name
     * @param {number} size - Size of the avatar in pixels
     * @returns {string} - Data URL for the avatar
     */
    generateDataUrl(name, size = 200) {
        const canvas = this.generateCanvas(name, size);
        return canvas.toDataURL('image/png');
    }
    
    /**
     * Get initials from a name
     * @param {string} name - User's name
     * @returns {string} - Initials (1-2 characters)
     */
    getInitials(name) {
        if (!name) return '?';
        
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) {
            return parts[0].charAt(0).toUpperCase();
        }
        
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    
    /**
     * Get a simple hash code from a string
     * @param {string} str - Input string
     * @returns {number} - Hash code
     */
    getHashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }
    
    /**
     * Set an avatar image for an element
     * @param {HTMLImageElement} imgElement - Image element to set
     * @param {string} name - User's name
     * @param {string} [fallbackSrc] - Fallback image source
     */
    setAvatar(imgElement, name, fallbackSrc) {
        if (!imgElement) return;
        
        if (name) {
            imgElement.src = this.generateDataUrl(name);
            imgElement.alt = name;
        } else if (fallbackSrc) {
            imgElement.src = fallbackSrc;
        }
    }
}

// Create global instance
const avatarGenerator = new AvatarGenerator();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = avatarGenerator;
}
