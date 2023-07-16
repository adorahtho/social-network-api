const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  postNewUser,
  putUpdateUser,
  deleteUser,
} = require('../../controllers/userController')

router.route('/').get(getUsers).post(postNewUser)

router
  .route('/:userId')
  .get(getSingleUser)
  .put(putUpdateUser)
  .delete(deleteUser);

module.exports = router;