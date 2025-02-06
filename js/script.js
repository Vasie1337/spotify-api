const clientId = config.clientId;
const redirectUri = config.redirectUri;

/**
 * Exchanges an authorization code for access and refresh tokens from Spotify API
 * @param {string} code - The authorization code received from Spotify
 * @returns {Promise<Object>} Object containing access_token and refresh_token
 */
async function getTokenFromCode(code) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: config.clientSecret
        })
    });
    
    return await response.json();
}

/**
 * Refreshes the access token using the stored refresh token
 * @returns {Promise<string>} A new access token
 * @throws {Error} If no refresh token is available or refresh fails
 */
async function refreshAccessToken() {
    const refresh_token = localStorage.getItem('refresh_token');
    
    if (!refresh_token) {
        throw new Error('No refresh token available');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
            client_id: clientId,
            client_secret: config.clientSecret
        })
    });

    const data = await response.json();
    if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        if (data.refresh_token) {
            localStorage.setItem('refresh_token', data.refresh_token);
        }
        return data.access_token;
    } else {
        throw new Error('Failed to refresh token');
    }
}

/**
 * Initiates the Spotify OAuth login process by redirecting to Spotify's authorization page
 */
function login() {
    const scope = 'user-read-private user-read-email user-top-read user-read-currently-playing user-read-playback-state user-modify-playback-state';
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    
    const params = {
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        show_dialog: true
    };
    
    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
}

/**
 * Handles the OAuth callback by processing the authorization code and storing tokens
 * @returns {Promise<void>}
 */
async function handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
        try {
            const response = await getTokenFromCode(code);
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            await loadUserProfile();
        } catch (error) {
            console.error('Error during authentication:', error);
        }
    }
}

/**
 * Loads and displays the user's Spotify profile information
 * Updates the UI to show user data and handle visibility of login/logout buttons
 * @returns {Promise<void>}
 */
async function loadUserProfile() {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Profile request failed');
        }

        const data = await response.json();
        
        const loginButton = document.getElementById('login-button');
        const logoutButton = document.getElementById('logout-button');
        const userProfile = document.getElementById('user-profile');
        
        if (loginButton && logoutButton && userProfile) {
            loginButton.classList.add('d-none');
            logoutButton.classList.remove('d-none');
            userProfile.classList.remove('d-none');
            document.getElementById('profile-image').src = data.images[0]?.url || '';
            document.getElementById('display-name').textContent = data.display_name;
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        await handleAuthError();
    }
}

/**
 * Makes an authenticated request to the Spotify API
 * Handles token refresh if the current token is expired
 * @param {string} endpoint - The Spotify API endpoint to call (starting with /)
 * @returns {Promise<Object>} The JSON response from the API
 * @throws {Error} If the request fails or authentication is invalid
 */
async function makeSpotifyRequest(endpoint) {
    let token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = 'index.html';
        throw new Error('No access token');
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            token = await refreshAccessToken();
            const newResponse = await fetch(`https://api.spotify.com/v1${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!newResponse.ok) {
                throw new Error('API request failed after token refresh');
            }
            
            return await newResponse.json();
        }

        if (!response.ok) {
            throw new Error('API request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Request error:', error);
        await handleAuthError();
        throw error;
    }
}

/**
 * Handles authentication errors by clearing stored tokens and redirecting to login
 * @returns {Promise<void>}
 */
async function handleAuthError() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = 'index.html';
}

/**
 * Logs out the user by clearing stored tokens and redirecting to the login page
 */
function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = 'index.html';
}

/**
 * Gets the current playback state including active device information
 * @returns {Promise<Object>} The playback state data
 */
async function getPlaybackState() {
    try {
        const response = await makeSpotifyRequest('/me/player');
        return response;
    } catch (error) {
        console.error('Error getting playback state:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    
    if (loginButton) {
        loginButton.addEventListener('click', login);
    }
    
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
    
    if (window.location.search.includes('code=')) {
        handleCallback();
    } else if (window.location.pathname !== '/index.html' && !localStorage.getItem('access_token')) {
        window.location.href = 'index.html';
    } else {
        loadUserProfile();
    }
});

