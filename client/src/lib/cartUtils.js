import { cart } from '../stores/shoppingCartStore.js';
import toastr from 'toastr';

function addToCart(jersey) {
	cart.update((items) => {
		const itemInCart = items.find((item) => item.id === jersey.id);
		if (itemInCart) {
			return items.map((item) =>
				item.id === jersey.id ? { ...item, quantity: item.quantity + 1 } : item
			);
		}
		toastr.success(`${jersey.playerName} ${jersey.team} jersey added to cart`);
		return [...items, { ...jersey, quantity: 1 }];
	});
}

function removeFromCart(product) {
	cart.update((items) => {
		const index = items.findIndex((item) => item.id === product.id);
		if (index !== -1) {
			if (items[index].quantity > 1) {
				items[index].quantity -= 1;
			} else {
				items.splice(index, 1);
			}
			toastr.info(`${product.playerName} ${product.team} jersey removed from cart`);
		}
		return items;
	});
}

export { addToCart, removeFromCart };
