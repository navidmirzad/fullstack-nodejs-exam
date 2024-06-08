<script>
	import { onMount } from 'svelte';
	import { addToCart } from '$lib/cartUtils.js';

	let jersey;

	async function fetchJersey(id) {
		try {
			const response = await fetch(`http://localhost:8080/api/jerseys/${id}`);
			if (!response.ok) {
				throw new Error('Failed to fetch jersey');
			}
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Failed to fetch jersey:', error);
			return null;
		}
	}

	const id = window.location.pathname.split('/').pop(); // Get the last part of the URL
	onMount(async () => {
		jersey = await fetchJersey(id);
	});
</script>

<div>
	{#if jersey}
		<div class="container mx-auto px-4">
			<div class="bg-[#dddcdc] py-8 border border-gray-400 mb-8">
				<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div class="flex flex-col md:flex-row -mx-4">
						<div class="md:flex-1 px-4">
							<div class=" rounded-lg mb-4 border border-gray-500">
								<img
									class=" h-full object-contain"
									src={jersey.imageUrl}
									alt="Product Image"
									aria-hidden="true"
								/>
							</div>
							<div class="flex -mx-2 mb-4">
								<div class="w-1/2 px-2">
									<button
										class="w-full bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700"
										on:click={() => addToCart(jersey)}
									>
										Add to Shopping Cart
									</button>
								</div>
							</div>
						</div>
						<div class="md:flex-1 ml-24 pt-14">
							<h2 class="text-2xl font-bold text-gray-800 mb-2">
								{jersey.playerName ? `${jersey.playerName} - ` : ''}{jersey.team}
							</h2>
							<div class="flex mb-4">
								<div class="mr-4">
									<span class="font-bold text-gray-700">Price:</span>
									<span class="font-bold text-gray-700">{jersey.priceDKK} DKK</span>
								</div>
								<div>
									<span class="font-bold text-gray-700">Availability:</span>
									<span class="text-gray-600">In Stock</span>
								</div>
							</div>

							<div class="mb-4">
								<span class="font-bold text-gray-700">Select Size:</span>
							</div>
							<div>
								<span class="font-bold text-gray-700">Product Description:</span>
								<p class="text-gray-600 text-sm mt-2">
									{jersey.description}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<p>Loading...</p>
	{/if}
</div>
