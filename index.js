const express = require('express');
const http = require('http');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => { res.status(200).send('Server is working.') });
app.listen(port, () => { console.log(`🌏 Server is running at http://localhost:${port}`) });



app.post('/getmovie', (req, res) => { 
    const movieToSearch = req.body.queryResult.parameters.movie || '';
    const reqUrl = encodeURI( `http://www.omdbapi.com/?t=${movieToSearch}&apikey=20173ffa` );

    http.get(reqUrl, responseFromAPI => {
        let completeResponse = responseFromAPI.on('data', chunk => { completeResponse += chunk });
        responseFromAPI.on('end', () => {
            console.log(completeResponse);
            const movie = JSON.parse(completeResponse.replace('[object Object]', ''));
            // return res.json(movie);
            let dataToSend = `${movie.Title} was released in the year ${movie.Year}. It is directed by ${ movie.Director } and stars ${movie.Actors}.\n Here some glimpse of the plot: ${movie.Plot}. }`;
            return res.json({ fulfillmentText: dataToSend, source: 'getmovie' })
        })
    }, error => { return res.json({ fulfillmentText: 'Could not get results at this time', source: 'getmovie' }) } )
})