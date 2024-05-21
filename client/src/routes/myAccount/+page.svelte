<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';

    let jwtToken;

    onMount(() => {
        jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            navigate('http://localhost:5173/login');
        } else {
            checkToken();
        }
    });

    async function checkToken() {
        try {
            const response = await fetch('http://localhost:8080/protected', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`
                }
            });

            if (!response.ok) {
                localStorage.removeItem('jwtToken');
                navigate('/login');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            navigate('/login');
        }
    }
</script>

{#if jwtToken}
<div class="container mx-auto">
    <h1>Welcome to My Account</h1>
</div>
{/if}
