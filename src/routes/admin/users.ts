import express from 'express';
const router = express.Router();
import usersController from '#controllers/admin/usersController';
import ROLES_LIST from '#config/roles_list';
import verifyRoles from '#middleware/verifyRoles';

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser);

export default router;
