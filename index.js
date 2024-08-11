
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const moment = require('moment');
const helmet = require('helmet');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));
app.use(cors());

// Create Order API
app.post('/place-order', (req, res) => {
   const { buyer_qty, buyer_price, seller_price, seller_qty } = req.body;

   // Validate input
   if (typeof buyer_qty !== 'number' || buyer_qty <= 0 || typeof buyer_price !== 'number' || buyer_price <= 0) {
       return res.status(400).json({ error: 'Invalid input' });
   }

   const sql = `INSERT INTO PendingOrderTable (buyer_qty, buyer_price, seller_price, seller_qty) VALUES (?, ?, ?, ?)`;
   db.query(sql, [buyer_qty, buyer_price, seller_price, seller_qty], (err, results) => {
       if (err) {
           console.error('SQL Error:', err.message);
           return res.status(500).json({ error: 'Internal Server Error' });
       }

       // Call the matchOrders function after inserting the order
       matchOrders();

       res.status(200).json({ id: results.insertId });
   });
});

const matchOrders = () => {
   db.beginTransaction((err) => {
       if (err) throw err;

       // Select matching orders
       const selectQuery = `
           SELECT * FROM PendingOrderTable
           WHERE buyer_price >= seller_price AND seller_price IS NOT NULL
           ORDER BY buyer_price ASC, seller_price ASC
       `;
       db.query(selectQuery, (err, orders) => {
           if (err) {
               return db.rollback(() => {
                   throw err;
               });
           }

           orders.forEach(order => {
               const { buyer_qty, buyer_price, seller_price, seller_qty, id } = order;

               // Match logic
               if (buyer_price >= seller_price) {
                   const matched_qty = Math.min(buyer_qty, seller_qty);

                   // Insert into CompletedOrderTable
                   const insertQuery = `INSERT INTO CompletedOrderTable (price, qty) VALUES (?, ?)`;
                   db.query(insertQuery, [seller_price, matched_qty], (err) => {
                       if (err) {
                           return db.rollback(() => {
                               throw err;
                           });
                       }

                       // Update quantities in PendingOrderTable
                       const updateBuyerQuery = `UPDATE PendingOrderTable SET buyer_qty = buyer_qty - ? WHERE id = ?`;
                       db.query(updateBuyerQuery, [matched_qty, id], (err) => {
                           if (err) {
                               return db.rollback(() => {
                                   throw err;
                               });
                           }
                       });

                       const updateSellerQuery = `UPDATE PendingOrderTable SET seller_qty = seller_qty - ? WHERE seller_price = ?`;
                       db.query(updateSellerQuery, [matched_qty, seller_price], (err) => {
                           if (err) {
                               return db.rollback(() => {
                                   throw err;
                               });
                           }
                       });
                   });
               }
           });

           db.commit((err) => {
               if (err) {
                   return db.rollback(() => {
                       throw err;
                   });
               }
               console.log('Transaction Complete.');
           });
       });
   });
};


// Get Orders API
app.get('/pending-orders', (req, res) => {
    db.query('SELECT * FROM PendingOrderTable', (err, results) => {
        if (err) {
            console.error('SQL Error:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        results = results.map(order => ({
         ...order,
         created_at: moment(order.created_at).format('YYYY-MM-DD HH:mm:ss'),
         updated_at: moment(order.updated_at).format('YYYY-MM-DD HH:mm:ss')
     }));
        res.json(results);
    });
});

app.get('/completed-orders', (req, res) => {
    db.query('SELECT * FROM CompletedOrderTable', (err, results) => {
        if (err) {
            console.error('SQL Error:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        results = results.map(order => ({
         ...order,
         created_at: moment(order.created_at).format('YYYY-MM-DD HH:mm:ss'),
         updated_at: moment(order.updated_at).format('YYYY-MM-DD HH:mm:ss')
     }));
        res.json(results);
    });
});

const PORT = process.env.PORT || 3036;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
