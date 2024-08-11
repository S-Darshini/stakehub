import React, { useState } from 'react';
import axios from 'axios';

const OrderForm = () => {
    const [buyerQty, setBuyerQty] = useState('');
    const [buyerPrice, setBuyerPrice] = useState('');
    const [sellerPrice, setSellerPrice] = useState('');
    const [sellerQty, setSellerQty] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3036/place-order', {
                buyer_qty: parseInt(buyerQty),
                buyer_price: parseInt(buyerPrice),
                seller_price: parseInt(sellerPrice),
                seller_qty: parseInt(sellerQty)
            });
            alert('Order placed successfully');
            setBuyerQty('');
            setBuyerPrice('');
            setSellerPrice('');
            setSellerQty('');
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    return (
        <div className="container mt-5 shadow py-4">
            <h2 className="mb-4 bg-secondary text-center text-white shadow">Place Order</h2>
            <form onSubmit={handleSubmit} className="form-group">
                <div className="mb-3">
                    <label className="form-label">Buyer Quantity:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={buyerQty}
                        onChange={(e) => setBuyerQty(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Buyer Price:</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={buyerPrice}
                        onChange={(e) => setBuyerPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Seller Price:</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={sellerPrice}
                        onChange={(e) => setSellerPrice(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Seller Quantity:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={sellerQty}
                        onChange={(e) => setSellerQty(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-success">Place Order</button>
            </form>
        </div>
    );
};

export default OrderForm;
