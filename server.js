// BASE SETUP
// =============================================================================

// call the packages we need
const express = require('express'); // call express
const app = express(); // define our app using express
const bodyParser = require('body-parser');
const morgan = require('morgan');
const isImageUrl = require('is-image-url');
const youtubedl = require('youtube-dl-exec'); // Updated to use youtube-dl-exec

// configure app to use bodyParser()
// this will let us get the data from a POST

// set the static folder
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json

const port = process.env.PORT || 3000; // set our port

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://prathambhatia741:salmanlodu@pratham.pxztvxm.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Thumb = require('./thumb');

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router(); 

router.use(function(req, res, next) {
   
    next(); 
});


router.get('/', (req, res) => {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});

// more routes for our API will happen here
router.route('/thumbs')
    .post(handlePostThumbs)
    .get(handleGetThumbs);

// more routes for our API will happen here
router.route('/imgs')
    .post(handlePostThumbsImgs)

function handlePostThumbs(req, res) {
    // Using youtube-dl-exec to fetch video info
    youtubedl(req.body.url, { dumpSingleJson: true })
    .then(info => {
        console.log(info);
        if (!('webpage_url' in info && 'title' in info && 'thumbnail' in info)) {
            console.log("youtube-dl-exec error, no thumbnail");
            res.status(409).send("No thumbnail found");
        } else {
            createNewThumb(req, res, info);
        }
    })
    .catch(err => {
        console.log("youtube-dl-exec error", err);
        res.status(409).send(err);
    });
}

function createNewThumb(req, res, info) {
    Thumb.findOne({
        url: info.webpage_url
    }, (err, thumb) => {
        console.log(thumb);
        if (err) {
            res.status(409).send(err);
        } else if (thumb) {
            res.status(409).json({error: "Thumb already exists"});
        } else {
            const thumb = new Thumb(); 
            thumb.url = info.webpage_url; // set the thumbs name (comes from the request)
            thumb.rating = 1400;
            thumb.title = info.title;
            thumb.img = info.thumbnail;
            thumb.save((err) => {
                console.log("saving thumb");
                if (err)
                    res.status(409).send(err);
                else {
                  handleGetThumbs(req, res);
                }
            });
        }
    });
}

function handlePostThumbsImgs(req, res) {
    if (!isImageUrl(req.body.img)) {
        console.log("url not an image");
        res.status(409).json({error: "URL not an image"});
    } else {
        Thumb.findOne({
            title: req.body.title,
            img: req.body.img
        }, (err, thumb) => {
            if (err) {
                res.status(409).send(err);
            } else if (thumb) {
                res.status(409).json({error: "Thumb already exists"});
            } else {
                const thumb = new Thumb(); 
                thumb.rating = 1400;
                thumb.title = req.body.title;
                thumb.img = req.body.img;
                thumb.save((err) => {
                    console.log("saving thumb");
                    if (err)
                        res.status(409).send(err);
                    Thumb.find((err, thumbs) => {
                        if (err)
                            res.status(409).send(err);
                        res.json(thumbs);
                    });
                });
            }
        });
    }
};

function handleGetThumbs(req, res) {
    Thumb.find().sort({
        "rating": -1
    }).exec((err, thumbs) => {
        if (err)
            res.status(409).send(err);
        res.json(thumbs);
    });
};

router.route('/thumbs/:thumb_id')

    .get((req, res) => {
        Thumb.findById(req.params.thumb_id, (err, thumb) => {
            if (err)
                res.status(409).send(err);
            res.json(thumb);
        });
    })

    .put((req, res) => {

        Thumb.findById(req.params.thumb_id, (err, thumb) => {
            if (err)
                res.status(409).send(err);

            thumb.rating = req.body.rating; // update the thumbs info

            thumb.save((err) => {
                if (err)
                    res.status(409).send(err);

                res.json({
                    message: 'Thumb updated!'
                });
            });
        });
    })
    .delete((req, res) => {
      Thumb.remove({ _id: req.params.thumb_id }, (err) => {
          if (!err) {
                  handleGetThumbs(req, res);
          }
          else {
                res.status(409).send(err);
          }
      });
    });

router.route('/match')
    .get((req, res) => {
        Thumb.estimatedDocumentCount().exec((err, count) => {

            const random = Math.floor(Math.random() * count);
            Thumb.findOne().skip(random).exec((err, thumb1) => {
                if (err) res.status(409).send(err);
                let random2 = Math.floor(Math.random() * count);
                let i = 0;
                while (random2 === random) {
                    random2 = Math.floor(Math.random() * count);
                    i++;
                    if (i > 100) {
                        return res.json({});
                    }
                }
                Thumb.findOne().skip(random2).exec((err2, thumb2) => {
                    if (err2) res.send(err2);
                    res.json({
                        match: [thumb1, thumb2]
                    });
                });
            });
        });
    })
    .post((req, res) => {

        function getRatingDelta(myRating, opponentRating, myGameResult) {
            if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
                return null;
            }

            const myChanceToWin = 1 / (1 + Math.pow(10, (opponentRating - myRating) / 400));
            return Math.round(32 * (myGameResult - myChanceToWin));
        }

        function getNewRating(myRating, opponentRating, myGameResult) {
            return myRating + getRatingDelta(myRating, opponentRating, myGameResult);
        }

        Thumb.findById(req.body.win._id, (err, thumb1) => {
            if (err)
                res.send(err);
            thumb1.rating = getNewRating(thumb1.rating, req.body.lose.rating, 1); // update the thumbs info
            thumb1.save((err) => {
                if (err)
                    res.send(err);
                Thumb.findById(req.body.lose._id, (err, thumb2) => {
                    if (err)
                        res.send(err);
                    thumb2.rating = getNewRating(thumb2.rating, req.body.win.rating, 0); // update the thumbs info
                    thumb2.save((err) => {
                        if (err)
                            res.send(err);
                        Thumb.estimatedDocumentCount().exec((err, count) => {

                            const random = Math.floor(Math.random() * count);
                            Thumb.findOne().skip(random).exec((err, thumb1) => {
                                if (err)
                                    res.send(err);
                                let random2 = Math.floor(Math.random() * count);
                                let i = 0;
                                while (random2 === random) {
                                    random2 = Math.floor(Math.random() * count);
                                    i++;
                                    if (i > 100) {
                                        return res.json({});
                                    }
                                }
                                Thumb.findOne().skip(random2).exec((err2, thumb2) => {
                                    if (err2)
                                        res.send(err2);
                                    res.json({
                                        match: [thumb1, thumb2]
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// FRONT END -------------------------------
app.get('/', (req, res) => {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.get('/result', (req, res) => {
    res.sendfile('./public/result.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.get('/add', (req, res) => {
    res.sendfile('add.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('LETSGOOO SERVER HAS STARTEDDD ' + port);
