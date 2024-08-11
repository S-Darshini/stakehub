// src/App.js
import React from 'react';
import OrderForm from './Components/Orderform';
import OrderTables from './Components/Ordertable';
import PriceChart from './Components/Chart';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    return (
        <div className="App">
            <h1 className='text-center bg-success p-2 shadow text-white '>STACKHUB Order Matching System</h1>
            <OrderForm />
            <OrderTables />
            <PriceChart />
            {/* <h1 className='text-center bg-success p-2 '> Order Matching System</h1> */}

        </div>
    );
}

export default App;
