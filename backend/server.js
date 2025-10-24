



const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const app = express();
const port = 3000;

// Middleware setup
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
  }
}));

// DB connection
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sims"
});

const db = con.promise(); // <-- wrap connection with promise()

con.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to database");
});

// Authentication routes (unchanged, using callbacks)
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  con.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length > 0) return res.status(400).json({ error: 'Username already exists' });

    con.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  con.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    req.session.user = results[0];
    res.json({ message: 'Login successful', user: req.session.user });
  });
});

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

app.get('/check-auth', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ authenticated: true, user: req.session.user });
  } else {
    res.status(401).json({ authenticated: false, error: 'Unauthorized' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

// Spare Part APIs
app.post('/api/spare-parts', (req, res) => {
  const { Name, Category, Quantity, UnitPrice, TotalPrice } = req.body;
  con.query(
    'INSERT INTO Spare_Part (Name, Category, Quantity, UnitPrice, TotalPrice) VALUES (?, ?, ?, ?, ?)',
    [Name, Category, Quantity, UnitPrice, TotalPrice],
    (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json({ message: 'Spare part added successfully' });
    }
  );
});

app.get('/api/spare-parts', (_, res) => {
  con.query('SELECT * FROM Spare_Part', (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
});

app.get('/api/spare-parts/:id', (req, res) => {
  con.query('SELECT * FROM Spare_Part WHERE SparePartID = ?', [req.params.id], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ message: 'Spare part not found' });
    res.json(result[0]);
  });
});

app.put('/api/spare-parts/:id', (req, res) => {
  const { Name, Category, Quantity, UnitPrice } = req.body;
  const TotalPrice = (Quantity * UnitPrice).toFixed(2);
  con.query(
    `UPDATE Spare_Part SET Name = ?, Category = ?, Quantity = ?, UnitPrice = ?, TotalPrice = ? WHERE SparePartID = ?`,
    [Name, Category, Quantity, UnitPrice, TotalPrice, req.params.id],
    (err, result) => {
      if (err || result.affectedRows === 0) return res.status(500).json({ message: 'Update failed' });
      res.json({ message: 'Spare part updated successfully' });
    }
  );
});

app.delete('/api/spare-parts/:id', (req, res) => {
  con.query('DELETE FROM Spare_Part WHERE SparePartID = ?', [req.params.id], (err, result) => {
    if (err || result.affectedRows === 0) return res.status(500).json({ message: 'Delete failed' });
    res.json({ message: 'Spare part deleted successfully' });
  });
});

// Stock-In
app.post('/api/stock-in', (req, res) => {
  const { SparePartID, StockInQuantity, StockInDate } = req.body;
  con.query('INSERT INTO Stock_In (SparePartID, StockInQuantity, StockInDate) VALUES (?, ?, ?)',
    [SparePartID, StockInQuantity, StockInDate],
    (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      con.query('UPDATE Spare_Part SET Quantity = Quantity + ? WHERE SparePartID = ?',
        [StockInQuantity, SparePartID],
        (err) => {
          if (err) return res.status(500).json({ message: 'Failed to update quantity' });
          res.json({ message: 'Stock-in successful' });
        }
      );
    }
  );
});

// Stock-Out
app.post('/api/stock-out', (req, res) => {
  const { SparePartID, StockOutQuantity, StockOutUnitPrice, StockOutDate } = req.body;
  const StockOutTotalPrice = (StockOutQuantity * StockOutUnitPrice).toFixed(2);

  con.query('INSERT INTO Stock_Out (SparePartID, StockOutQuantity, StockOutUnitPrice, StockOutTotalPrice, StockOutDate) VALUES (?, ?, ?, ?, ?)',
    [SparePartID, StockOutQuantity, StockOutUnitPrice, StockOutTotalPrice, StockOutDate],
    (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });

      con.query('UPDATE Spare_Part SET Quantity = Quantity - ? WHERE SparePartID = ? AND Quantity >= ?',
        [StockOutQuantity, SparePartID, StockOutQuantity],
        (err, result) => {
          if (err || result.affectedRows === 0) {
            return res.status(400).json({ message: 'Insufficient stock' });
          }
          res.json({ message: 'Stock-out successful' });
        }
      );
    }
  );
});

app.get('/api/stock-outs', (_, res) => {
  const query = `
    SELECT so.StockOutID, so.SparePartID, sp.Name, sp.Category, so.StockOutQuantity, so.StockOutUnitPrice, so.StockOutTotalPrice, so.StockOutDate
    FROM Stock_Out so
    JOIN Spare_Part sp ON so.SparePartID = sp.SparePartID
    ORDER BY so.StockOutDate DESC
  `;
  con.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Fetch error' });
    res.json(results);
  });
});

app.delete('/api/stock-out/:id', (req, res) => {
  con.query('DELETE FROM Stock_Out WHERE StockOutID = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Delete error' });
    res.json({ message: 'Stock-out deleted' });
  });
});

app.put('/api/stock-out/:id', (req, res) => {
  const { StockOutQuantity, StockOutUnitPrice, StockOutDate } = req.body;
  const StockOutTotalPrice = (StockOutQuantity * StockOutUnitPrice).toFixed(2);

  con.query(
    `UPDATE Stock_Out SET StockOutQuantity = ?, StockOutUnitPrice = ?, StockOutTotalPrice = ?, StockOutDate = ? WHERE StockOutID = ?`,
    [StockOutQuantity, StockOutUnitPrice, StockOutTotalPrice, StockOutDate, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Update error' });
      res.json({ message: 'Stock-out updated' });
    }
  );
});

// Reports and Stock Status
app.get('/api/report/daily-stockout/:date', (req, res) => {
  const date = req.params.date;
  const query = `
    SELECT 
      sp.Name, sp.Category, so.StockOutQuantity AS Quantity, 
      DATE_FORMAT(so.StockOutDate, '%Y-%m-%d') AS Date, 
      so.StockOutTotalPrice AS TotalPrice
    FROM stock_out so
    JOIN spare_part sp ON so.SparePartID = sp.SparePartID
    WHERE so.StockOutDate >= ? AND so.StockOutDate < DATE_ADD(?, INTERVAL 1 DAY)
  `;

  con.query(query, [date, date], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error' });

    let totalQuantity = 0, totalPrice = 0;
    results.forEach(row => {
      totalQuantity += Number(row.Quantity);
      totalPrice += Number(row.TotalPrice);
    });

    res.json({
      data: results,
      totals: { totalQuantity, totalPrice }
    });
  });
});

app.get('/api/report/stock-status', (req, res) => {
  const query = `
    SELECT
      sp.Name AS SparePartName,
      CAST(sp.Quantity AS UNSIGNED) AS StoredQuantity,
      IFNULL(SUM(CAST(so.StockOutQuantity AS UNSIGNED)), 0) AS TotalStockOutQuantity,
      CAST(sp.Quantity AS UNSIGNED) - IFNULL(SUM(CAST(so.StockOutQuantity AS UNSIGNED)), 0) AS RemainingQuantity
    FROM spare_part sp
    LEFT JOIN stock_out so ON sp.SparePartID = so.SparePartID
    GROUP BY sp.Name, sp.Quantity
  `;

  con.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(results);
  });
});



// API to get total quantities and prices summary for dashboard
app.get('/api/dashboard-totals', async (req, res) => {
  try {
    // Total quantity and total price from Spare_Part
    const [sparePartTotals] = await db.query(`
      SELECT 
        SUM(Quantity) AS totalQuantity, 
        SUM(TotalPrice) AS totalPrice 
      FROM Spare_Part
    `);

    // Total stock-in quantity
    const [stockInTotals] = await db.query(`
      SELECT 
        SUM(StockInQuantity) AS totalStockInQuantity
      FROM Stock_In
    `);

    // Total stock-out quantity and total price
    const [stockOutTotals] = await db.query(`
      SELECT 
        SUM(StockOutQuantity) AS totalStockOutQuantity,
        SUM(StockOutTotalPrice) AS totalStockOutPrice
      FROM Stock_Out
    `);

    res.json({
      sparePartTotalQuantity: sparePartTotals[0].totalQuantity || 0,
      sparePartTotalPrice: sparePartTotals[0].totalPrice || 0,
      totalStockInQuantity: stockInTotals[0].totalStockInQuantity || 0,
      totalStockOutQuantity: stockOutTotals[0].totalStockOutQuantity || 0,
      totalStockOutPrice: stockOutTotals[0].totalStockOutPrice || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get dashboard totals' });
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
