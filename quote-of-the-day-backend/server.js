require('dotenv').config();
const express = require('express');
const cors = require('cors');
const oracledb = require('oracledb');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Oracle DB configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

// Function to get a random quote
const getRandomQuote = async () => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT content, author FROM quotes ORDER BY DBMS_RANDOM.VALUE FETCH FIRST 1 ROWS ONLY`
        );
        if (result.rows.length === 0) {
            throw new Error('No quotes found in the database');
        }
        return result.rows[0];
    } catch (err) {
        console.error('Error fetching random quote:', err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('Connection closed successfully.');
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
};

// API endpoint to get a random quote
app.get('/random-quote', async (req, res) => {
    try {
        const quote = await getRandomQuote();
        res.json({ content: quote[0], author: quote[1] });
    } catch (err) {
        res.status(500).send('Failed to fetch random quote: ' + err.message);
    }
});

// Function to search for quotes by author
const searchQuoteByAuthor = async (author) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT content, author FROM quotes WHERE LOWER(author) LIKE :author`,
            [`%${author.toLowerCase()}%`]
        );
        return result.rows;
    } catch (err) {
        console.error('Error searching quote by author:', err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log('Connection closed successfully.');
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
};

// API endpoint to search quotes by author
app.get('/search-quote', async (req, res) => {
    try {
        const author = req.query.author;
        const quotes = await searchQuoteByAuthor(author);
        res.json(quotes.map(row => ({ content: row[0], author: row[1] })));
    } catch (err) {
        res.status(500).send('Failed to search quotes: ' + err.message);
    }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../quote-of-the-day-frontend/build')));

// The catch-all handler: for any request that doesn't match the above, send back the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../quote-of-the-day-frontend/build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
