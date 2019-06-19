const mongoose    = require('mongoose'),
      url         = process.env.MLAB_URL,
      options     = {
            useNewUrlParser:    true,
            useCreateIndex:     true,
            user:               process.env.DB_USER,
            pass:               process.env.DB_PASS,
            autoReconnect :true
    };

mongoose.connect(url ,options).then(
        () => {
            console.log('connected');
        },
        err => {
            console.log(`connection error: ${err}`);
        }
);