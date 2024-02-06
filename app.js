const express = require('express');
const axios = require('axios'); // Import axios for API requests
const app = express();
const port = 1337;

// Enable CORS for all origins (for development purposes)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Route to fetch verse data from the ESV API with dynamic parameters
app.get('/:book/:chapter/:verse', async (req, res) => {
  try {
    const { book, chapter, verse } = req.params; // Extract parameters from request URL
    const query = `${book}+${chapter}:${verse}`;

    const response = await axios.get(
      `https://api.esv.org/v3/passage/text/?q=${query}`,
      {
        headers: {
          Authorization: 'Token cadcc75af1f6e2f7550c92ba5968606d3943cc56',
        },
      }
    );

    const reference = response.data.canonical;
    const passage = response.data.passages[0];

    const serverResponse = [reference, passage];

    console.log(serverResponse);

    res.json({ serverResponse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch verse' });
  }
});

// Serve the React app statically (assuming it's built in a 'build' directory)
app.use(express.static('build'));

// Catch-all route for React app routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
