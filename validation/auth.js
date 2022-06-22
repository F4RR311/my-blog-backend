import {body} from "express-validator";

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль мин 5 симв').isLength({min: 5}),
    body('fullName', "Укажите имя").isLength({min: 3}),
    body('avatarUrl', "Неверная ссылка на аватар").optional().isURL(),


]