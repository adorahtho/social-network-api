const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  postNewUser,
  putUpdateUser,
  deleteUser,
  postNewFriend,
  deleteFriend,
} = require('../../co;ntrollers/userController');

router.route('/').get(getUsers).post(postNewUser);

router
  .route('/:userId')
  .get(getSingleUser)
  .put(putUpdateUser)
  .delete(deleteUser);

router
  .route('/:userId/friends/:friendId')
  .post(addFriend)
  .delete(removeFriend);

module.exports = router;