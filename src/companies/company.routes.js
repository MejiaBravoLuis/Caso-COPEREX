import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js"
import { validarCampos } from "../middlewares/validar-campos.js"
import { newCompany ,listCompanies, updateCompany, generateAndOpenCompaniesReport } from "./company.controller.js";
import { existCompanyAlready, existCompanyById } from "../helpers/db-validator.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("name", "Name is required").not().isEmpty(),
        check("name").custom(existCompanyAlready),
        check("impact", "The impact level is required").not().isEmpty(),
        check("impact", "Invalid impact value").isIn(["Low", "Medium", "High"]),
        check("trayectory", "The trayectory year is required").not().isEmpty(),
        check("trayectory", "Trayectory must be a positive number").isInt({ min: 0 }),
        check("category", "The category is required").not().isEmpty(),
        validarCampos,
    ],
    newCompany
);


router.put(
    "/update/:id",
    [
        validarJWT,
        check("id", "Seems like this ID isn't valid").isMongoId(),
        check("id").custom(existCompanyById),
        check("name", "Name is required").not().isEmpty(),
        check("impact", "The impact level is required").not().isEmpty(),
        check("impact", "Invalid impact value").isIn(["Low", "Medium", "High"]),
        check("trayectory", "The trayectory year is required").not().isEmpty(),
        check("trayectory", "Trayectory must be a positive number").isInt({ min: 0 }),
        check("category", "The category is required").not().isEmpty(),
        validarCampos,
    ],
    updateCompany
);

router.get(
    "/",
    [ validarJWT ],
    listCompanies
)

router.get(
    "/generateReport",
    [validarJWT],
     generateAndOpenCompaniesReport
);

export default router;