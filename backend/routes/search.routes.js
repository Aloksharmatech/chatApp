const express = require("express");
const { searchUsers } = require("../controller/search.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = express.Router();

router.get("/users", isAuthenticated, searchUsers);

module.exports = router;
