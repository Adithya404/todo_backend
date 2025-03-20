import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change if needed
    password: 'qwerty', // Change if needed
    database: 'mydb'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Fetch all tasks
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM todos', (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

// Add a task
app.post('/tasks', (req, res) => {
    const { task } = req.body;
    if (!task) return res.status(400).send('Task is required');
    db.query('INSERT INTO todos (task) VALUES (?)', [task], (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send({ id: result.insertId, task });
        }
    });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM todos WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send('Task deleted');
        }
    });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
