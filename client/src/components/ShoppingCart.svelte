<script>
  import { cart } from '../stores/shoppingCartStore.js';
  import { onMount } from 'svelte';

  let isCartOpen = false; 

  function removeFromCart(product) {
    const currentCart = $cart;
    const index = currentCart.findIndex(item => item.id === product.id);

    if (index !== -1) {
      currentCart.splice(index, 1);
      cart.set(currentCart);
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
                  <li class="flex justify-between items-center border-b border-gray-200 py-2">
                      <span>{item.name} - ${item.price}</span>
                      <button class="text-red-500" on:click={() => removeFromCart(item)}>Remove</button>
                  </li>
              {/each}
          </ul>
      {/if}
      <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" on:click={() => checkout()}>Checkout</button>
  </div>
</div>
