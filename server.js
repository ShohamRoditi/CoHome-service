const   express      = require('express'),
        app          = express(),
        cors         = require('cors');
        parser       = require('body-parser'),
        port         = process.env.PORT || 3000,
        apartmentCtl = require('./controllers/apartment.ctl'),
        userCtl      = require('./controllers/user_pic.ctl'),

app.set('port', port);
app.use(cors());
app.use(parser.json({extended : true}));
app.use('/', express.static('./public'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Request-Method", "PUT, DELETE, GET, POST");
    res.header("HTTP/1.1 200 OK");
    res.set("Content-Type", "application/json");
    next();
});

/*** apartment routes ***/
app.get('/getYourApartment', apartmentCtl.getYourApartment);
app.post('/addApartment', apartmentCtl.addApartment);
app.put('/updateExpenses', apartmentCtl.updateExpenses);
app.put('/updateRating', apartmentCtl.updateRating);
app.delete('/deleteTenant', apartmentCtl.deleteTenant);

/***  pics routes***/
app.get('/getUsersPic', userCtl.getUsersPic);




const server = app.listen(port, () => {
    console.log(`listening on port ${port}`);
});


app.all('*', (req, res) => {
    res.status(404).send(`{"result": "Failure", "error": "Bad Route"}`)
});