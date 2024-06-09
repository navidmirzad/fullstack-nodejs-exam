<script>
	import '../app.css';
	import Navigation from '../components/Navigation.svelte';
	import Footer from '../components/Footer.svelte';
	import { onMount } from 'svelte';
	import socket from '../lib/socket.js';
	import toastr from 'toastr';

	onMount(() => {
		socket.connect();

		socket.on('orderCreated', () => {
			toastr.info(`Someone just ordered a jersey!`);
		});

		return () => {
			socket.disconnect();
		};
	});
</script>

<Navigation />

<main>
	<slot></slot>
</main>

<Footer />
