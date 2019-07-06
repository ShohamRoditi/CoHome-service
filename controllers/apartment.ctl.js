const   fetch       = require('node-fetch'),
        apartment   = require('../models/apartment');


module.exports = {
    /* Gets all expenses */
    getYourApartment:async (req, res) => {
        const { address = null} = req.query
         apartment.find({address:address}).then(result => {
            if(result)
                res.send(JSON.stringify(result));
            else res.status(404).send(`{"Failure": "No Documents Were Found"}`);
        }, err =>{
            res.status(404).send(`{"Failure": "No Documents Were Found"}`);
        });
    },
    addApartment: async (req,res) => {
        const {monthly_payment = null, address = null, owner = null, phone = null, tenants = null} = req.body
        const Apartment  = new apartment({address, owner, phone, monthly_payment, tenants});
        apartment.find({address:address})
        .then(json_mlab => {
            if(json_mlab.length === 0){
                Apartment.save().then(result => {
                    res.status(200).send(`"res": ${JSON.stringify(result)}`)
                })
            }
            else {
                apartment.find({tenants: tenants, address:address})
                .then(json => {
                    if(json.length === 0){
                        apartment.updateOne({address: address}, {$push: {tenants: tenants}}).then(result => {
                            res.status(200).send(`"res": ${JSON.stringify(result)}`)
                        })
                    }
                    else
                        res.status(200).send(`"Tenant is already exists in apartment": ${JSON.stringify(tenants)}`)
                })
                .catch(err => {
                    res.status(404).send(`"error": ${JSON.stringify(err)}`)
                })                
            }
            })
    },

    updateExpenses: async (req,res) => {
        const { _id = null, address = null, owner = null, phone = null, monthly_payment = null,tenants = null} = req.body
        apartment.updateMany({address: address, monthly_payment: {$elemMatch: {type: monthly_payment.type}}}, {'$set': {
            'monthly_payment.$.paid': monthly_payment.paid, 'monthly_payment.$.paid_by': monthly_payment.paid_by, 'monthly_payment.$.status_paid':monthly_payment.status_paid, 'monthly_payment.$.date':monthly_payment.date
        }}).then(result => {
            if(result && result.nModified > 0){
                apartment.find({address: address/*, monthly_payment:{$elemMatch:{paid_by: monthly_payment.paid_by}}*/})
                .then( result2 => {
                    result2[0].tenants.forEach(element => {
                        if (element.name === monthly_payment.paid_by){
                            const sum_payment = element.paid_this_month + monthly_payment.paid
                            apartment.updateOne({address: address, tenants: {$elemMatch: {name: tenants.name}}}, {'$set': {
                                'tenants.$.paid_this_month': sum_payment
                            }}).then(result3 =>{
                                if(result3 && result3.nModified > 0)
                                    res.status(200).send(`{"result": "Success", "params": {"type": "${monthly_payment.type}", "paid": "${monthly_payment.paid}"}}`);
                                else
                                    res.status(404).send(`{"result": "Failure", "params":{"type": "${monthly_payment.type}", "paid": "${monthly_payment.paid}"}}`);
                                return;
                            }) .catch(err => {
                                res.status(404).send(`"error": ${JSON.stringify(err)}`)
                            }) 
                        }
                    })
                }) .catch(err => {
                    res.status(404).send(`"error": ${JSON.stringify(err)}`)
                }) 
            }

            else res.status(404).send(`{"result": "Failure", "params": {"type": "${monthly_payment.type}", "brand": "${monthly_payment.paid}"}}`)
            }, err => {
                res.status(404).send(`{"result": "Failure", "params":{"type": "${monthly_payment.type}", "paid": "${monthly_payment.paid}"}, "error": ${JSON.stringify(err)}}`);
        });


    },

    updateRating: async (req, res) => {
        const { _id = null, address = null, owner = null, phone = null, monthly_payment = null,tenants = null} = req.body
        apartment.find({address: address})
        .then( result => {
            result[0].tenants.forEach(element => {
                if (element.name === tenants.name){
                    const sum_rating = element.rating + tenants.rating
                    apartment.updateOne({address: address, tenants: {$elemMatch: {name: tenants.name}}}, {'$set': {
                        'tenants.$.rating': sum_rating
                    }}).then(result =>{
                        if(result && result.nModified > 0){
                            res.status(200).send(`{"result": "Success", "params": {"name": "${tenants.name}", "rating": "${tenants.rating}"}}`);
                        }
            
                        else{
                            res.status(404).send(`{"result": "Failure", "params": {"name": "${tenants.name}", "rating": "${tenants.rating}"}}`);
                        }
                    }).catch(err => {
                        res.status(404).send(`"error": ${JSON.stringify(err)}`)
                    })               
            
                }
            })
        })
    },

    deleteTenant: async (req, res) => {
        const {address= null,  tenants = null} = req.body;
        const update = {$pull: {tenants: {name: tenants.name}}};
        apartment.updateOne({address: address}, update).then( (result) => {
            if(result && result.nModified > 0)
                res.status(200).send(`{"result": "Success", "params":{"address": "${address}", "name": "${tenants.name}"}}`);
            else res.status(404).send(`{"result": "Failure", "params":{"address": "${address}", "name": "${tenants.name}"}}`);
        },
        (err) => {
            console.log(err);
            res.status(404).send(`{"result": "Failure", "params":{"email": "${req.body.email}", "id": "${req.query._id}", "error": ${JSON.stringify(err)}}`);
        });     
    },
    updatePrize: async (req, res) => {
        const { _id = null, address = null, owner = null, phone = null, monthly_payment = null,tenants = null} = req.body
        apartment.find({address: address})
        .then( result => {
            result[0].tenants.forEach(element => {
                if (element.name === tenants.name){
                    apartment.updateOne({address: address, tenants: {$elemMatch: {name: tenants.name}}}, {'$set': {
                        'tenants.$.prize':tenants.prize
                    }}).then(result =>{
                        if(result && result.nModified > 0){
                            res.status(200).send(`{"result": "Success", "params": {"name": "${tenants.name}", "prize": "${tenants.prize}"}}`);
                        }  
                        else{
                            res.status(404).send(`{"result": "Failure", "params": {"name": "${tenants.name}", "prize": "${tenants.prize}"}}`);
                        }
                    }).catch(err => {
                        res.status(404).send(`"error": ${JSON.stringify(err)}`)
                    })               
                }
            })
        })
    }
}