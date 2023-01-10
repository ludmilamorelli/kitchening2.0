const express = require('express');
const router = express.Router();
const {search, add, store, edit, update, destroy, detail} = require('../controllers/productsController');

const productImageStore = require('../middlewares/productImageStore');
const productsValidator = require('../validations/productsValidator');

router.get('/search',search);
router.get('/detail/:id',detail);
router.get('/add',add);
router.post('/add',productImageStore.array('image'), productsValidator, store);
router.get('/edit/:id',edit);
router.put('/update/:id',productImageStore.array('image'),productsValidator, update);
 router.delete('/destroy/:id',destroy);


module.exports = router;