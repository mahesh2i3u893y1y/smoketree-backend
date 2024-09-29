const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const cors = require("cors")

// Initialize the Express app
const app = express();


// Body parser middleware
app.use(cors())
app.use(bodyParser.json());

// POST API to insert user and address
app.post('/register', (req, res) => {
  const { name, address } = req.body;

  // Insert user into the User table
  db.run(`INSERT INTO User (name) VALUES (?)`, [name], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error creating user', error: err.message });
    }
    const userId = this.lastID;

    // Insert address into the Address table, linking it to the newly created user
    db.run(`INSERT INTO Address (userId, address) VALUES (?, ?)`, [userId, address], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error creating address', error: err.message });
      }

      res.status(201).json({
        message: 'User and Address created successfully!',
        user: { id: userId, name },
        address: { id: this.lastID, address, userId }
      });
    });
  });
});


app.get('/users-address-relation', (req, res) => {
    const query = `
      SELECT User.id as userId, User.name, Address.id as addressId, Address.address
      FROM User
      LEFT JOIN Address ON User.id = Address.userId
    `;
  
    db.all(query, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      // Organize the results into a structured format
      const users = rows.reduce((acc, row) => {
        const user = acc.find(u => u.userId === row.userId);
        
        if (!user) {
          acc.push({
            userId: row.userId,
            name: row.name,
            addresses: row.addressId ? [{ addressId: row.addressId, address: row.address }] : []
          });
        } else if (row.addressId) {
          user.addresses.push({ addressId: row.addressId, address: row.address });
        }
        
        return acc;
      }, []);
  
      res.json(users);
    });
  });

  app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM User';
    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      // Send the rows as JSON
      res.json({
        message: 'success',
        data: rows
      });
    });
  });

app.get('/address',  (req,res) =>{

  const query = `SELECT * FROM Address;`
  db.all(query, [], (err,rows) =>{
    if(err){
      return res.status(500).json({err:err.message})
    }
    res.json({
      message:"success",
      data:rows
    })
  })
})  


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
