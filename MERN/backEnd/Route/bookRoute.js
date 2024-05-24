const express = require('express');
const router = express.Router;
const {getAllBook, getOneBook, uploadBook, updateBook, deleteBook} = require('../Route/bookRoute.js');

router.route('/').get(getAllBook).post(uploadBook);
router.route('/:id').get(getOneBook).patch(updateBook).delete(deleteBook);

module.exports = router;


