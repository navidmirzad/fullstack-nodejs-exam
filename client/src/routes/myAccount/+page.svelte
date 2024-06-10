<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import toastr from 'toastr';

	let jwtToken = writable(null);
	let userInfo = writable(null);
	let orders = writable([]);
	let userAddress = writable({
		street: '',
		city: '',
		state: '',
		zip_code: '',
		country: ''
	});
	let addressExists = writable(false);

	async function fetchOrders(token) {
		if (!token) return;
		try {
			const response = await fetch('http://localhost:8080/api/orders', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			if (response.ok) {
				const data = await response.json();
				orders.set(data);
			}
		} catch (error) {
			toastr.error('Failed to fetch orders:', error);
		}
	}

	async function fetchAddress(token) {
		if (!token) return;
		try {
			const response = await fetch('http://localhost:8080/api/address', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			if (response.ok) {
				const data = await response.json();
				if (data && data.length > 0) {
					userAddress.set(data[0]);
					addressExists.set(true);
				} else {
					addressExists.set(false);
				}
			}
		} catch (error) {
			toastr.error('Error fetching address:', error);
		}
	}

	async function checkToken(token) {
		try {
			const response = await fetch('http://localhost:8080/protected', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			if (response.ok) {
				const data = await response.json();
				userInfo.set(data);
				await fetchAddress(token); // Ensure we wait for the address fetch
			} else {
				localStorage.removeItem('jwtToken');
				jwtToken.set(null);
			}
		} catch (error) {
			localStorage.removeItem('jwtToken');
			jwtToken.set(null);
		}
	}

	onMount(async () => {
		const token = localStorage.getItem('jwtToken');
		jwtToken.set(token);
		if (token) {
			await checkToken(token);
			await fetchOrders(token);
		}
	});

	async function handleAddressSubmit(event) {
		event.preventDefault();
		const formData = new FormData(event.target);
		const address = {
			street: formData.get('street'),
			city: formData.get('city'),
			state: formData.get('state'),
			zip_code: formData.get('zip_code'),
			country: formData.get('country')
		};

		const token = localStorage.getItem('jwtToken');
		if (!token) return;

		try {
			const method = $addressExists ? 'PUT' : 'POST';
			const response = await fetch('http://localhost:8080/api/address', {
				method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(address)
			});

			if (response.ok) {
				const updatedAddress = await response.json();
				userAddress.set(updatedAddress);
				addressExists.set(true);
				toastr.success('Address updated successfully');
			} else {
				toastr.error('Failed to update address');
			}
		} catch (error) {
			toastr.error('Failed to update address');
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
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			if (response.ok) {
				const data = await response.json();
				localStorage.setItem('jwtToken', data.token);
				localStorage.setItem('refreshToken', data.refreshToken);
				jwtToken.set(data.token);
				userInfo.set(data.user);
				window.location.href = '/myAccount';
			} else {
				toastr.warning('Invalid email or password');
			}
		} catch (error) {
			toastr.warning('Invalid email or password');
		}
	}

	async function handleLogout(event) {
		event.preventDefault();

		const refreshToken = localStorage.getItem('refreshToken');
		if (!refreshToken) return;

		try {
			const response = await fetch('http://localhost:8080/logout', {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${refreshToken}`
				}
			});

			if (response.ok) {
				jwtToken.set(null);
				userInfo.set(null);
				localStorage.removeItem('jwtToken');
				localStorage.removeItem('refreshToken');
				toastr.info('Logged out successfully');
			}
		} catch (error) {
			toastr.info('Error occurred while logging out');
		}
	}
</script>

{#if $jwtToken}
	<div class="container mx-auto">
		{#if $userInfo}
			<p class="flex justify-center pt-4 font-bold text-xl">Logged in with: {$userInfo.email}</p>
		{/if}
		<div class="flex justify-center">
			<button
				on:click={handleLogout}
				class="mt-4 mb-4 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
				>Logout</button
			>
		</div>

		{#if $orders.length === 0}
			<p class="text-center text-gray-500 mt-4">You have no orders.</p>
		{:else}
			<div class="max-w-4xl mx-auto p-4">
				<h2 class="text-2xl font-bold text-center mb-6">Order History</h2>
				<ul>
					{#each $orders as order}
						<li class="border-b border-gray-300 py-4">
							<div class="flex flex-col mb-4">
								<span class="font-semibold text-lg text-gray-800">Order ID: {order.id}</span>
								<span class="text-gray-600"
									>Order Date: {new Date(order.order_date).toLocaleString()}</span
								>
							</div>
							<ul class="ml-4">
								{#each order.products as product}
									<li class="mb-2">
										<div class="flex flex-col bg-gray-100 p-3 rounded shadow-sm">
											<span class="font-semibold text-gray-900">{product.playerName}</span>
											<span class="text-gray-700">{product.team}</span>
											<span class="text-gray-600">{product.priceDKK} DKK x {product.quantity}</span>
										</div>
									</li>
								{/each}
							</ul>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<form on:submit={handleAddressSubmit} class="bg-[#acacac] p-4 mb-8 rounded-lg shadow-md">
			<h2 class="text-xl font-semibold mt-6 mb-4">Address</h2>
			<div class="mb-4">
				<label for="street" class="block text-sm font-medium text-gray-700">Street</label>
				<input
					type="text"
					id="street"
					name="street"
					bind:value={$userAddress.street}
					required
					class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				/>
			</div>
			<div class="mb-4">
				<label for="city" class="block text-sm font-medium text-gray-700">City</label>
				<input
					type="text"
					id="city"
					name="city"
					bind:value={$userAddress.city}
					required
					class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				/>
			</div>
			<div class="mb-4">
				<label for="state" class="block text-sm font-medium text-gray-700">State</label>
				<input
					type="text"
					id="state"
					name="state"
					bind:value={$userAddress.state}
					required
					class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				/>
			</div>
			<div class="mb-4">
				<label for="zip_code" class="block text-sm font-medium text-gray-700">Zip Code</label>
				<input
					type="text"
					id="zip_code"
					name="zip_code"
					bind:value={$userAddress.zip_code}
					required
					class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				/>
			</div>
			<div class="mb-4">
				<label for="country" class="block text-sm font-medium text-gray-700">Country</label>
				<input
					type="text"
					id="country"
					name="country"
					bind:value={$userAddress.country}
					required
					class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				/>
			</div>
			<button
				type="submit"
				class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-900"
			>
				Save Address
			</button>
		</form>
	</div>
{:else}
	<div class="container mx-auto px-4 flex justify-center pt-10 pb-10">
		<div
			class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
		>
			<form class="space-y-6" on:submit={handleLogin}>
				<h5 class="text-xl font-medium text-gray-900 dark:text-white">Login</h5>
				<div>
					<label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>Your email</label
					>
					<input
						type="email"
						name="email"
						id="email"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
						placeholder="name@company.com"
						required
					/>
				</div>
				<div>
					<label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						>Your password</label
					>
					<input
						type="password"
						name="password"
						id="password"
						placeholder="••••••••"
						class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
						required
					/>
				</div>
				<button
					type="submit"
					class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>Login to your account</button
				>
				<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
					Don't have an account? <a
						href="/signup"
						class="text-blue-700 hover:underline dark:text-blue-500">Sign Up</a
					>
				</div>
			</form>
		</div>
	</div>
{/if}
