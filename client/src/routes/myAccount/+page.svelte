<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    let jwtToken = writable(null);
    let userInfo = writable(null);

    onMount(() => {
        const token = localStorage.getItem('jwtToken');
        console.log('JWT Token from localStorage:', token);
        jwtToken.set(token);
        if (token) {
            checkToken(token);
        }
    });

    /* Fix checkToken / entire auth is broken */
     async function checkToken(token) {
        try {
            const response = await fetch('http://localhost:8080/protected', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                userInfo.set(data); // Assume the response contains user information
            } else {
                /* localStorage.removeItem('jwtToken');
                jwtToken.set(null); */
            }
        } catch (error) {
            console.error('An error occurred:', error);
            /* localStorage.removeItem('jwtToken');
            jwtToken.set(null); */
        }
    } 

    async function handleLogin(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('jwtToken', data.token);
                localStorage.setItem('refreshToken', data.refreshToken);
                jwtToken.set(data.token);
                userInfo.set(data.user); 
            } else {
                console.error('Login failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }
</script>

{#if $jwtToken}
    <div class="container mx-auto">
        <h1>Welcome to My Account</h1>
        {#if $userInfo}
            <p>Email: {$userInfo.email}</p>
            <!-- Display other user info as needed -->
        {/if}
    </div>
{:else}
    <div class="container mx-auto px-4 flex justify-center pt-10 pb-10">
        <div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form class="space-y-6" on:submit={handleLogin}>
                <h5 class="text-xl font-medium text-gray-900 dark:text-white">Login</h5>
                <div>
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                    <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required />
                </div>
                <div>
                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                    <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                </div>
                <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>
                <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Don't have an account? <a href="/signup" class="text-blue-700 hover:underline dark:text-blue-500">Sign Up</a>
                </div>
            </form>
        </div>
    </div>
{/if}
