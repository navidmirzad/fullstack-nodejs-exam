<script>
	import '../app.css';
	import ShoppingCart from '../components/ShoppingCart.svelte';
	import { goto } from '$app/navigation';

	let isCartOpen = false;
	let searchQuery = '';

	function toggleCartModal() {
		isCartOpen = !isCartOpen;
	}

	function handleSearch(event) {
		event.preventDefault();
		goto(`/search?query=${encodeURIComponent(searchQuery)}`);
		searchQuery = '';
	}
</script>

<div class="w-full flex items-center justify-between bg-[#bbb] py-4 pr-52">
	<a href="mailto:footyjersey@hotmail.com" class="contact-link pl-52">footyjersey@hotmail.com</a>
	<ul class="flex space-x-4">
		<li><a href="/" class="text-gray-700 hover:text-blue-500">Home</a></li>
		<li><a href="/about" class="text-gray-700 hover:text-blue-500">About</a></li>
		<li><a href="/about" class="text-gray-700 hover:text-blue-500">Contact</a></li>
		<li><a href="/myAccount" class="text-gray-700 hover:text-blue-500">My Account</a></li>
		<li>
			<a href="#" on:click={toggleCartModal} class="text-gray-700 hover:text-blue-500"
				><img src="/src/public/images/cart.png" class="w-8 h-auto" alt="shoppingCart" /></a
			>
		</li>
	</ul>
</div>

{#if isCartOpen}
	<ShoppingCart />
{/if}

<div class="container mx-auto px-4">
	<div class="flex justify-between items-center py-2">
		<a href="/"
			><img src="/src/public/images/footyLogo.png" class="w-32 h-auto" alt="Footy Jersey Logo" /></a
		>
		<form class="w-2/3" on:submit={handleSearch}>
			<label for="default-search" class="sr-only">Search</label>
			<div class="relative">
				<input
					type="search"
					id="default-search"
					bind:value={searchQuery}
					class="block w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
					placeholder="FC Barcelona..."
					required
				/>
				<button
					type="submit"
					class="absolute right-0 top-0 bottom-0 px-4 bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
					>Search</button
				>
			</div>
		</form>
	</div>
	<nav class="bg-gray-800 text-white py-4 text-xl">
		<ul class="flex justify-around space-x-4">
			<li><p>FootyJersey</p></li>
		</ul>
	</nav>
</div>
