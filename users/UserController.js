const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users/", (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", { users: users });
    });
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: { email: email } }).then(user => {
        if (user == undefined) {
            var salt = bcrypt.genSaltSync(10);//cria o salt
            var hash = bcrypt.hashSync(password, salt);//cria o hash 

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/admin/users/");
            }).catch((erro) => {
                res.redirect("/");
            });
        } else {
            res.redirect("/admin/users/create");
        }
    });
});

router.post("/users/delete", (req, res) => {
    var id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {//checa se id é numero
            User.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/users");
            });
        } else {//nao e numero
            res.redirect("/admin/users");
        }
    } else {//null
        res.redirect("/admin/users");
    }
});

module.exports = router;