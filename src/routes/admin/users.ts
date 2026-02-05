import express from 'express';
import usersController from '#controllers/admin/usersController';
import ROLES_LIST from '#config/roles_list';
import verifyRoles from '#middleware/verifyRoles';
import { validate } from '#middleware/validate';
import { userIdSchema, deleteUserSchema } from '#schemas/userSchema';

const router = express.Router();

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .delete(verifyRoles(ROLES_LIST.Admin), validate(deleteUserSchema), usersController.deleteUser);

router.route('/:id')
    .get(verifyRoles(ROLES_LIST.Admin), validate(userIdSchema), usersController.getUser);

export default router;
