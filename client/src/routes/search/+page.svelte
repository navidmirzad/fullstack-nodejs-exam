<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import { addToCart } from '../../lib/cartUtils.js';
	import toastr from 'toastr';

	let jerseys = writable([]);
	let query = '';

	$: query = new URLSearchParams($page.url.search).get('query');

	async function fetchSearchResults() {
		try {
			const response = await fetch(`http://localhost:8080/api/search?query=${query}`);
			const data = await response.json();
			jerseys.set(data);
		} catch (error) {
			toastr.error('Failed to fetch search results:', error);
		}
	}

	onMount(() => {
		fetchSearchResults();
	});

	$: $page.url.search, fetchSearchResults(); // Fetch results whenever the search query changes
</script>

<div class="container mx-auto px-4 pb-8">
	{#if $jerseys.length > 0}
		<div>
			<p class="font-bold text-2xl py-4 text-center">Search Results for "{query}"</p>
			<div class="flex justify-center">
				<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{#each $jerseys as jersey}
						<div
							class="relative flex flex-col rounded-xl bg-[#dddcdc] bg-clip-border text-gray-700 shadow-md"
						>
							<div
								class="relative mx-4 mt-4 h-80 overflow-hidden rounded-xl bg-white bg-clip-border text-gray-700"
							>
								<a href={`/jerseys/${jersey.id}`}>
									<img src={jersey.imageUrl} class="h-full w-full object-cover" alt={jersey.name} />
								</a>
							</div>
							<div class="p-4 bg-[#dddcdc]">
								<div class="mb-2 flex items-center justify-between">
									<p
										class="block font-sans text-base font-medium leading-relaxed text-blue-gray-900 antialiased"
									>
										{jersey.playerName ? `${jersey.playerName} - ` : ''}{jersey.team}
									</p>
									<p
										class="block font-sans text-base font-medium leading-relaxed text-blue-gray-900 antialiased"
									>
										{jersey.priceDKK} DKK
									</p>
								</div>
								<p
									class="block font-sans text-sm font-normal leading-normal text-gray-700 antialiased opacity-75"
								>
									{jersey.description}
								</p>
							</div>
							<div class="p-4 pt-0">
								<button
									class="block w-full bg-[#ffff] select-none rounded-lg bg-blue-gray-900/10 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-blue-gray-900 transition-all hover:scale-105 focus:scale-105 focus:opacity-[0.85] active:scale-100 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
									type="button"
									on:click={() => addToCart(jersey)}
								>
									Add to Cart
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<p>No results found for "{query}".</p>
	{/if}
</div>
