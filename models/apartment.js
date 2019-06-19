var mongoose    = require('mongoose'),
    apartment   = new mongoose.Schema({
        address:        String,
        owner:          String,
        phone:          String,
        monthly_payment:[],
        //  [{
        //         type: String,
        //         status_paid: Boolean,
        //         paid: Number,
        //         date: String,
        //         paid_by: String
        // }],
        tenants:[]
});

// monthly_payment:[{type: String,
//     status_paid: Boolean,
//     paid: Number,
//     date: String,
//     paid_by: String}],

/* Validations */
apartment.path('tenants').validate( 
    (val) => {
        if (!val)
            return false;
        
        return true;
    }, "Tenants is not defined .");

apartment.path('monthly_payment').validate( 
    (val) => {
        if (!val)
            return false;
        
        return true;
    }, "monthly_payment validation.");


// /* End Of Validations*/

var Appartment = mongoose.model('apartment', apartment);

module.exports = Appartment;