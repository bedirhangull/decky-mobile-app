// These constants are used in app/index.tsx for development routing.
// Both redirects only work in development mode (__DEV__ === true).

// SANDBOX: When set to "true", redirects to /sandbox route
// (useful for testing sandbox features)

// WIP_SCREEN_HREF: When set to any value other than "",
// redirects to the specified route path
// (useful for quickly navigating to a specific app/route during development)
// Example: WIP_SCREEN_HREF=/whatsapp/chats

export const SANDBOX = false;
export const WIP_SCREEN_HREF = "";
