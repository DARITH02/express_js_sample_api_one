import express from 'express';
import {deleteSlide, getAllSlid, postSlide} from "../controllers/slidesContrller.js";
import {upload} from "../middleware/upload.js";

const router = express.Router();

router.get('/slides',getAllSlid)
router.post('/slide', upload.single("image"),postSlide);
router.delete('/slide/:id',deleteSlide);








//
//
//
//
//
//
//
export default router;