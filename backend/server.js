const express = require('express');
const cors = require('cors');
const neo4j = require('neo4j-driver');

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your Neo4j credentials
const driver = neo4j.driver(
  "neo4j+s://490e17b3.databases.neo4j.io",
  neo4j.auth.basic("neo4j", "l76b6YjwTXUDsDUFDx7WG8lZg8RJH1XyFJmf37IT9I4")
);

app.get('/api/nodes', async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run('MATCH (n) RETURN n LIMIT 5');
    const nodes = result.records.map(record => record.get('n').properties);
    res.json(nodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.close();
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
