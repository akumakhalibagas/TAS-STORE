var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM bagstore",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("bagstore/list", {
          title: "Bag",
          data: rows,
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});

router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var bag = {
        id: req.params.id,
      };

      var delete_sql = "delete from bagstore where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          bag,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/bag");
            } else {
              req.flash("msg_info", "Delete Bag Success");
              res.redirect("/bag");
            }
          }
        );
      });
    });
  }
);
router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM bagstore where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/bag");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "Bag can't be find!");
              res.redirect("/bag");
            } else {
              console.log(rows);
              res.render("bagstore/edit", {
                title: "Edit ",
                data: rows[0],
                session_store: req.session,
              });
            }
          }
        }
      );
    });
  }
);
router.put(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.assert("nama", "Please fill the nama").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_nama = req.sanitize("nama").escape().trim();
      v_merk = req.sanitize("merk").escape().trim();
      v_harga = req.sanitize("harga").escape().trim();
      v_stock = req.sanitize("stock").escape();

      var bag = {
        nama: v_nama,
        harga: v_harga,
        merk: v_merk,
        stock: v_stock,
      };

      var update_sql = "update bagstore SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          bag,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("bagstore/edit", {
                nama: req.param("nama"),
                harga: req.param("harga"),
                merk: req.param("merk"),
                stock: req.param("stock"),
              });
            } else {
              req.flash("msg_info", "Update bag success");
              res.redirect("/bag/edit/" + req.params.id);
            }
          }
        );
      });
    } else {
      console.log(errors);
      errors_detail = "<p>Sory there are error</p><ul>";
      for (i in errors) {
        error = errors[i];
        errors_detail += "<li>" + error.msg + "</li>";
      }
      errors_detail += "</ul>";
      req.flash("msg_error", errors_detail);
      res.redirect("/bagstore/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("nama", "Please fill the nama").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_nama = req.sanitize("nama").escape().trim();
    v_merk = req.sanitize("merk").escape().trim();
    v_harga = req.sanitize("harga").escape().trim();
    v_stock = req.sanitize("stock").escape();

    var bag = {
      nama: v_nama,
      harga: v_harga,
      merk: v_merk,
      stock: v_stock,
    };

    var insert_sql = "INSERT INTO bagstore SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        bag,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("bagstore/add-bag", {
              nama: req.param("nama"),
              harga: req.param("harga"),
              merk: req.param("merk"),
              stock: req.param("stock"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Create bag success");
            res.redirect("/bag");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("bagstore/add-bag", {
      nama: req.param("nama"),
      merk: req.param("merk"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("bagstore/add-bag", {
    title: "Add New Bag",
    nama: "",
    merk: "",
    stock: "",
    harga: "",
    session_store: req.session,
  });
});

module.exports = router;
