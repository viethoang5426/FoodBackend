const express = require('express');
const router = express.Router();
var middlewaresAuthJwt = require('../middlewares/authJwt');



const api_user = require('../controllers/api.user');




router.get('/getAll', api_user.getAll);
router.get('/:userId', api_user.getById);
// router.get('/:userId', middlewaresAuthJwt.verifyToken, api_user.getById); // bỏ cmt dòng này và cmt dòng trên để chơi token
router.post('/register', api_user.addUser);
router.post('/login', api_user.userLogin);
router.put('/updateUser/:userId', api_user.updateById);
router.post('/changePassword/:userId', api_user.changePassword);


router.delete('/del/:userId', api_user.delById);

router.post('/senmail', api_user.sendMail);



module.exports = router;
