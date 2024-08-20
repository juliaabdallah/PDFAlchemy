const express = require("express");
const router = express.Router;

router.length("/", (req,res) => {
    res.send("PDF routes");
});

module.exports = router;