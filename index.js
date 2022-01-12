const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const darkSkyApiKey = process.env.darkSkyApiKey;
const googleMapsApiKey =
    process.env.googleMapsApiKey || 'AIzaSyCOFlUHQy4TKQxd__h_j3AU4xRzcp3HRJ4';
const openCageApiKey = process.env.openCageApiKey;

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

app.get('/', async(req, res) => {
    res.json({status: 'App is up and running'})
});

app.get('/forecast', async(req, res) => {
    const params = req.query;

    axios
        .get(
            `https://api.darksky.net/forecast/${darkSkyApiKey}/${params.latitude},${params.longitude}`
        )
        .then((response) => {
            console.log(response.data);
            console.log(response.status);
            res.json(response.data);
        })
    
});

app.get('/maps/api/place/autocomplete/json', async (req, res) => {
    const params = req.query;
    const apiUrl =
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?` +
        `input=${params.input}&types=${params.types}&key=${googleMapsApiKey}`;
    axios
        .get(
            apiUrl
        )
        .then((response) => {
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
    axios
        .get(
            apiUrl
        )
        .then((response) => {
            // key=${googleMapsApiKey}
            console.log(apiUrl);
            // console.log(response.data);
            // console.log(response.status);
            res.json(response.data);
        });
});

app.get('/maps/api/reverse-geocode/json', async (req, res) => {
    const params = req.query;
    const apiUrl =
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${params.latitude},${params.longitude}&key=${googleMapsApiKey}`;
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