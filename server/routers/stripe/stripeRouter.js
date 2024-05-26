import { Router } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = Router();


router.post("/api/checkout", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: req.body.map(item => ({
                price_data: {
                    currency: "dkk",
                    product_data: {
                        name: `${item.playerName} ${item.team}`, 
                    },
                    unit_amount: item.priceDKK * 100,
                },
                quantity: item.quantity,
            })),
            success_url: `${process.env.CLIENT_URL}/myAccount`,
            cancel_url: `${process.env.CLIENT_URL}/myAccount`,
        });
        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;
