import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderTable = () => {
    const [pendingOrders, setPendingOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const [pendingRes, completedRes] = await Promise.all([
                    axios.get('http://localhost:3036/pending-orders'),
                    axios.get('http://localhost:3036/completed-orders')
                ]);
                setPendingOrders(pendingRes.data);
                setCompletedOrders(completedRes.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="container mt-5 shadow p-2">
            <h2 className="mb-4 bg-secondary text-center text-white">Pending Orders</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Buyer Qty</th>
                        <th>Buyer Price</th>
                        <th>Seller Price</th>
                        <th>Seller Qty</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingOrders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.buyer_qty}</td>
                            <td>{order.buyer_price}</td>
                            <td>{order.seller_price}</td>
                            <td>{order.seller_qty}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2 className="mb-4 bg-secondary text-center text-white">Completed Orders</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Price</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {completedOrders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.price}</td>
                            <td>{order.qty}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;
