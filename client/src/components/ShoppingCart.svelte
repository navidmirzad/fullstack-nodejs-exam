<script>
    import { cart } from '../stores/shoppingcartstore.js';
    import { onMount } from 'svelte';
    import toastr from 'toastr';

  
    let isCartOpen = false; 
  
    function removeFromCart(product) {
      const currentCart = $cart;
      const index = currentCart.findIndex(item => item.id === product.id);
  
      if (index !== -1) {
        if (currentCart[index].quantity > 1) {
          currentCart[index].quantity -= 1;
        } else {
          currentCart.splice(index, 1);
        }
        toastr.info("Removed from cart")
        cart.set(currentCart);
      }
    }

    function checkout() {
        console.log($cart);
        cart.set([]);
        window.location.href = '/checkout';
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
        <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" on:click={() => checkout()}>Checkout</button>
    </div>
  </div>
  