<script>
	import { onMount } from 'svelte';
	import io from 'socket.io-client';

	let socket;

	onMount(() => {
		socket = io('http://localhost:8080');

		socket.on('connect', () => {
			console.log('Connected to WebSocket server');

			// Listen for messages from the server
			socket.on('message', (message) => {
				console.log('Message from server:', message);
			});

			// Listen for new orders
			socket.on('orderCreated', (order) => {
				console.log('New order created:', order);
			});
		});

		return () => {
			socket.disconnect();
		};
	});

	function sendMessage() {
		socket.emit('clientMessage', 'Hello from the client!');
	}
</script>

<button on:click={sendMessage}> Send Message to Server </button>
