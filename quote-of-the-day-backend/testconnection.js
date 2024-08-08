const oracledb = require('oracledb');

const dbConfig = {
    user: 'saurabh',
    password: 'saurabh',
    connectString: 'DESKTOP-G7FR461:1521/PRAJKTA'
};

async function testConnection() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log('Connection successful!');
    } catch (err) {
        console.error('Connection failed:', err);
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
}

testConnection();
