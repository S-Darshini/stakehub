import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const PriceChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchCompletedOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3036/completed-orders');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching completed orders:', error);
            }
        };

        fetchCompletedOrders();
    }, []);

    return (
        <div className="container my-5 shadow">
            <h2 className="mb-4 bg-secondary text-white  text-center">Price Chart</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="created_at" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PriceChart;
