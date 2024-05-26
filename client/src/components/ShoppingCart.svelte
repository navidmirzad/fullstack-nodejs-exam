<script>
	import { cart } from '../stores/shoppingCartStore.js';
	import { onMount } from 'svelte';
	import { removeFromCart } from '../lib/cartUtils.js';
	import toastr from 'toastr';
	import { get } from 'svelte/store';

	let isCartOpen = false;

	async function checkout() {
		try {
			const $cart = get(cart);
			const response = await fetch('http://localhost:8080/api/checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(
					$cart.map((item) => ({
						playerName: item.playerName,
						team: item.team,
						priceDKK: item.priceDKK,
						quantity: item.quantity
					}))
				)
			});

			if (response.ok) {
				const { url } = await response.json();
				window.location.href = url;
				cart.set([]);
			} else {
				toastr.error('Checkout failed');
			}
		} catch (error) {
			toastr.error('Checkout failed');
		}
	}

	function handleClickOutside(event) {
		const modal = document.querySelector('.cart-modal');
		if (modal && !modal.contains(event.target)) {
			isCartOpen = false;
		}
	}

	onMount(() => {
		window.addEventListener('click', handleClickOutside);

		return () => {
			window.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="cart-modal fixed top-0 right-0 flex items-center justify-center z-50">
	<div class="bg-[#b1b1b1] p-4 rounded-lg">
		<h2 class="text-2xl font-bold mb-4">Your Cart</h2>
		{#if $cart.length === 0}
			<p>Your cart is empty.</p>
		{:else}
			<ul>
				{#each $cart as item}
					<li class="border-b border-gray-200 py-2">
						<div class="flex flex-col">
							<span class="font-semibold">{item.playerName}</span>
							<span>{item.team}</span>
							<span>{item.priceDKK} DKK x {item.quantity}</span>
						</div>
						<button class="text-red-500 mt-2" on:click={() => removeFromCart(item)}>Remove</button>
					</li>
				{/each}
			</ul>
		{/if}
		<button
			class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
			on:click={() => checkout()}>Checkout</button
		>
	</div>
</div>
