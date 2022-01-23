const express = require('express');
const axios = require('axios');
const cors = require('cors');
const getColors = require('get-image-colors');

const app = express();
const darkSkyApiKey = process.env.darkSkyApiKey;
const googleMapsApiKey = process.env.googleMapsApiKey;
const openCageApiKey = process.env.openCageApiKey;
const wordsApiKey = process.env.wordsApiKey;
const giphyApiKey = process.env.giphyApiKey;
const currentNewsApiKey = process.env.currentNewsApiKey;
const bibleApiKey = process.env.bibleApiKey;

app.use(express.json());
app.use(
    cors({
        origin: '*'
    })
);
const port = process.env.PORT || 80;

app.listen(port, () => {
    console.log(`shinkhouse apis listening on port ${port}`);
});

app.get('/', async (req, res) => {
    res.json({ status: 'App is up and running' });
});
app.get('/dictionary/random', async (req, res) => {
    var options = {
        method: 'GET',
        url: 'https://wordsapiv1.p.rapidapi.com/words/',
        params: { random: 'true' },
        headers: {
            'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
            'x-rapidapi-key': wordsApiKey
        }
    };

    axios
        .request(options)
        .then(function (response) {
            res.json(response.data);
        })
        .catch(function (error) {
            console.error(error);
        });
});
app.get('/dictionary/words/:word', async (req, res) => {
    console.log(req.params, req.query);
    var options = {
        method: 'GET',
        url: `https://wordsapiv1.p.rapidapi.com/words/${req.params.word}`,
        headers: {
            'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
            'x-rapidapi-key': wordsApiKey
        }
    };

    axios
        .request(options)
        .then(function (response) {
            res.json(response.data);
        })
        .catch(function (error) {
            console.error(error);
        });
});

app.get('/forecast', async (req, res) => {
    const params = req.query;

    axios
        .get(
            `https://api.darksky.net/forecast/${darkSkyApiKey}/${params.latitude},${params.longitude}`
        )
        .then((response) => {
            console.log(response.data);
            console.log(response.status);
            res.json(response.data);
        });
});

app.get('/gifs/search', async (req, res) => {
    const apiUrl = `https://api.giphy.com/v1/gifs/search?q=${req.query.q}%20&api_key=${giphyApiKey}&limit=50`;

    axios.get(apiUrl).then((response) => {
        res.json(response.data);
    });
});

app.get('/gifs/trending', async (req, res) => {
    const apiUrl = `https://api.giphy.com/v1/gifs/trending?q=${req.query.q}%20&api_key=${giphyApiKey}&limit=50`;

    axios.get(apiUrl).then((response) => {
        res.json(response.data);
    });
});

app.get('/maps/api/place/autocomplete/json', async (req, res) => {
    const params = req.query;
    const apiUrl =
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
        `input=${params.input}&types=${params.types}&key=${googleMapsApiKey}`;
    axios.get(apiUrl).then((response) => {
        console.log(apiUrl);
        console.log(response.data);
        console.log(response.status);
        res.json(response.data);
    });
});

app.get('/maps/api/geocode/json', async (req, res) => {
    const params = req.query;
    const apiUrl =
        `https://maps.googleapis.com/maps/api/geocode/json?` +
        `address=${params.address}&key=${googleMapsApiKey}`;
    axios.get(apiUrl).then((response) => {
        // key=${googleMapsApiKey}
        console.log(apiUrl);
        // console.log(response.data);
        // console.log(response.status);
        res.json(response.data);
    });
});

app.get('/maps/api/reverse-geocode/json', async (req, res) => {
    const params = req.query;
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${params.latitude},${params.longitude}&key=${googleMapsApiKey}`;
    axios.get(apiUrl).then((response) => {
        // key=${googleMapsApiKey}
        console.log(apiUrl);
        // console.log(response.data);
        // console.log(response.status);
        res.json(response.data);
    });
});

app.get('/geocode/v1/json', async (req, res) => {
    const params = req.query;
    axios
        .get(
            `https://api.opencagedata.com/geocode/v1/json?q=` +
                `=${params.address}&key=${openCageApiKey}`
        )
        .then((response) => {
            console.log(response.data);
            console.log(response.status);
            res.json(response.data);
        });
});

app.post('/get-colors-from-image', async (req, res) => {
    const imageUrl = req.body.url;
    const imageData = await getBufferFromURL(imageUrl);
    const options = {
        count: 10,
        type: 'image/jpeg'
    };

    getColors(imageData, options).then((colors) => {
        // `colors` is an array of 10 color objects
        const colorMap = colors.map((color) => color.hex());
        res.json(colorMap);
    });
});

app.get('/latest-news', async (req, res) => {
    const params = req.query;
    axios
        .get(
            `https://api.currentsapi.services/v1/latest-news?apiKey=${currentNewsApiKey}`
        )
        .then((response) => {
            res.json(response.data);
        });
});

app.get('/search-news', async (req, res) => {
    const params = req.query;
    axios
        .get(
            `https://api.currentsapi.services/v1/search?apiKey=${currentNewsApiKey}&keywords=${params.searchQuery}&category=${params.category}`
        )
        .then((response) => {
            res.json(response.data);
        });
});

async function getBufferFromURL(url) {
    try {
        const request = await axios.get(url, {
            responseType: 'arraybuffer'
        });
        return new Buffer.from(request.data);
    } catch (err) {
        throw err;
    }
}
