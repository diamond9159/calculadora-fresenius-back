const express = require('express');
const router = express.Router();

//get
router.get('/logout', require('./controllers/logout'));
router.get('/get_date', require('./controllers/getDate'));
router.get('/get_users', require('./controllers/get_users'));
router.get('/get_products', require('./controllers/get_products'));
router.get('/obtener_productos', require('./controllers/obtener_productos'));
router.get('/get_history', require('./controllers/get_history'));
router.get('/status', require('./controllers/status'));


//post
router.post('/login', require('./controllers/login'));
router.post('/add_history', require('./controllers/add_history'));
router.post('/add_product', require('./controllers/add_product'));
router.post('/add_user', require('./controllers/add_user'));
router.post('/edit_user', require('./controllers/edit_user'));
router.post('/edit_product', require('./controllers/edit_product'));
router.post('/delete_user', require('./controllers/delete_user'));
router.post('/delete_product', require('./controllers/delete_product'));

module.exports = router;