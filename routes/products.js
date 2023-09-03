var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display user page
router.get('/', function(req, res, next) {      
    dbConn.query('SELECT * FROM products ORDER BY id desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            // render to views/products/index.ejs
            res.render('products',{data:''});   
        } else {
            // render to views/products/index.ejs
            res.render('products',{data:rows});
        }
    });
});

// display add user page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('products/add', {
        name: '',
        quantitiy: '',
        supplier:''
    })
})

// add a new user
router.post('/add', function(req, res, next) {    

    let name = req.body.name;
    let quantitiy = req.body.quantitiy;
    let supplier = req.body.supplier;
    let errors = false;

    if(name.length === 0 || quantitiy.length === 0 || supplier === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and quantitiy and supplier");
        // render to add.ejs with flash message
        res.render('products/add', {
            name: name,
            quantitiy: quantitiy,
            supplier:supplier
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            name: name,
            quantitiy: quantitiy,
            supplier:supplier
        }
        
        // insert query
        dbConn.query('INSERT INTO products SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('products/add', {
                    name: form_data.name,
                    quantitiy: form_data.quantitiy,
                    supplier:form_data.supplier
                })
            } else {                
                req.flash('success', 'User successfully added');
                res.redirect('/products');
            }
        })
    }
})

// display edit user page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM products WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('/products')
        }
        // if user found
        else {
            // render to edit.ejs
            res.render('products/edit', {
                title: 'Edit User', 
                id: rows[0].id,
                name: rows[0].name,
                quantitiy: rows[0].quantitiy,
                supplier: rows[0].supplier
            })
        }
    })
})

// update user data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let quantitiy = req.body.quantitiy;
    let supplier = req.body.supplier;
    let errors = false;

    if(name.length === 0 || quantitiy.length === 0 || supplier.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter name and quantitiy and supplier");
        // render to add.ejs with flash message
        res.render('products/edit', {
            id: req.params.id,
            name: name,
            quantitiy: quantitiy,
            supplier:supplier
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            name: name,
            quantitiy: quantitiy,
            supplier:supplier
        }
        // update query
        dbConn.query('UPDATE products SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('products/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    quantitiy: form_data.quantitiy,
                    supplier: form_data.supplier
                })
            } else {
                req.flash('success', 'User successfully updated');
                res.redirect('/products');
            }
        })
    }
})
   
// delete user
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM products WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to user page
            res.redirect('/products')
        } else {
            // set flash message
            req.flash('success', 'User successfully deleted! ID = ' + id)
            // redirect to user page
            res.redirect('/products')
        }
    })
})

module.exports = router;