const express        = require('express');
const router         = express.Router();
const userController = require('../controllers/user.controller');

router.route(
    '/'
).get(
    userController.get //* Get all persons
).post(
    userController.post //* Create person
);

router.route(
    '/:id_person'
).get(
    userController.getById //* Get person by id
).put(
    userController.put //* Update person by id
).delete(
    userController.delete //* Delete person by id
);

module.exports = router;