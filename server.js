const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost', 
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'db1234',
    database: process.env.DB_NAME || 'employee_management'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

app.get('/',(req,res)=>{
    res.send('Server is ready and running');
});
app.post('/api/employees', (req, res) => {
    const { firstName, lastName, employeeID, email, phone, department, dateOfJoining, role } = req.body;
    const checkQuery = 'SELECT * FROM employees WHERE employeeID = ? OR email = ?';
    db.query(checkQuery, [employeeID, email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database query error' });
        if (results.length > 0) return res.status(400).json({ message: 'Employee ID or Email already exists' });

        const insertQuery = 'INSERT INTO employees (firstName, lastName, employeeID, email, phone, department, dateOfJoining, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(insertQuery, [firstName, lastName, employeeID, email, phone, department, dateOfJoining, role], (err) => {
            if (err) return res.status(500).json({ message: 'Error inserting employee' });
            res.status(200).json({ message: 'Employee added successfully!' });
        });
    });
});

app.get('/api/employees', (req, res) => {
    const query = 'SELECT * FROM employees';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching employees' });
        }
        res.status(200).json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
