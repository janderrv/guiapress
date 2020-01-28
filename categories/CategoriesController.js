const express = require("express");
const router = express.Router();

router.get("/categories", (req,res)=>{
    res.send("rota categorias");
});


module.exports = router;