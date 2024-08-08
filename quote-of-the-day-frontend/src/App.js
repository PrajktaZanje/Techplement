// frontend/src/App.js
import React, { useState, useEffect } from 'react';

function App() {
    const [quote, setQuote] = useState('');
    const [author, setAuthor] = useState('');
    const [searchAuthor, setSearchAuthor] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Function to fetch a random quote
    const fetchRandomQuote = async () => {
        setLoading(true);
        try {
            const response = await fetch('/random-quote');
            if (response.ok) {
                const data = await response.json();
                setQuote(data.content);
                setAuthor(data.author);
            } else {
                console.error("Error fetching the quote:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching the quote:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to search for quotes by author
    const searchQuoteByAuthor = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/search-quote?author=${searchAuthor}`);
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data);
            } else {
                console.error("Error searching quotes:", response.statusText);
            }
        } catch (error) {
            console.error("Error searching quotes:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch a random quote when the component mounts
    useEffect(() => {
        fetchRandomQuote();
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Quote of the Day</h1>
            {loading ? <p>Loading...</p> : (
                <>
                    <p>{quote}</p>
                    <p><strong>{author}</strong></p>
                    <button onClick={fetchRandomQuote}>Get Another Random Quote</button>
                </>
            )}

            <div style={{ marginTop: '50px' }}>
                <h2>Search Quotes by Author</h2>
                <input 
                    type="text" 
                    value={searchAuthor} 
                    onChange={(e) => setSearchAuthor(e.target.value)} 
                    placeholder="Enter author name"
                />
                <button onClick={searchQuoteByAuthor}>Search</button>

                {loading && <p>Loading search results...</p>}
                {searchResults.length > 0 && (
                    <div>
                        <h3>Search Results:</h3>
                        {searchResults.map((result, index) => (
                            <p key={index}>"{result.content}" - <strong>{result.author}</strong></p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
