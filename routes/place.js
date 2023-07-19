const express = require('express');
const router = express.Router();
const {check} = require('express-validator');

const placeControllers = require('../controllers/place')

router.get('/:pid', placeControllers.getPlaceById);
router.get('/user/:uid', placeControllers.getPlacesByUserId);
router.post('/', 
    [
        check('title').not().isEmpty(), 
        check('description').isLength({min : 10}),
        check('address').not().isEmpty(),
    ],
    placeControllers.createPlace
);
router.patch('/:pid', 
    [
        check('title').not().isEmpty(), 
        check('description').isLength({min : 10}),
    ],
    placeControllers.updatePlace
);
router.delete('/:pid', placeControllers.deletePlace);

module.exports = router;