<!-- <script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';

    let jwtToken;

    onMount(() => {
        jwtToken = localStorage.getItem('jwtToken');
        if (jwtToken) {
            navigate('http://localhost:5173/myAccount');
        }
    });

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
                navigate('/myAccount'); 
            } else {
                console.error('Login failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }
</script>

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
 -->