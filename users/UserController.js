const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middleware/adminauth");

router.get("/admin/users/", adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", { users: users });
    });
});

router.get("/admin/users/create", adminAuth, (req, res) => {
    res.render("admin/users/create");
});

router.post("/users/create", adminAuth, (req, res) => {
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

router.post("/users/delete", adminAuth, (req, res) => {
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

router.get("/login", (req, res) => {
    res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ where: { email: email } }).then(user => {
        if (user != undefined) {
            var correct = bcrypt.compareSync(password, user.password);//checa has
            if (correct) {
                //cria sessao
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");
            } else {
                res.redirect("/login");
            }
        }
        else {
            res.redirect("/login");
        }
    });
});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

module.exports = router;