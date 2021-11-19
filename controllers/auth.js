const mysql = require('mysql');
const db = require('../model/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var verifier = require('email-verify');
var emailjs = require('emailjs-com');
const {
  promisify
} = require('util');
const alert = require('alert');


//login 
exports.login = async (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return res.status(400).render("login", {
      message: 'Please provide email and password'
    });
  }

  // 2) Check if user exists && password is correct
  db.start.query('SELECT * FROM students WHERE email = ?', [email], async (error, results) => {
    if (results == 0) {
      return res.status(401).render("login", {
        message: 'Email does not exist'
      });
    }
    console.log(results);
    console.log(password);
    const isMatch = await bcrypt.compare(password, results[0].password);
    console.log(isMatch);
    if (!results || !isMatch) {
      return res.status(401).render("login", {
        message: 'Incorrect email or password'
      });
    } else {
      // 3) If everything ok, send token to client
      const id = results[0].id;
      console.log(id);
      const token = jwt.sign({
        id
      }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
      });

      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
      };
      res.cookie('jwt', token, cookieOptions);
      res.render('profile', {
        message: 'Login Successful!'
      });
    }
  });
};

//register
exports.register = (req, res) => {

  console.log(req.body);
  const {
    name,
    email,
    password,
    c_password,
    rollno,
    dob
  } = req.body;

  db.start.query('SELECT email FROM students WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
    }
    if (!name || !email || !password || !c_password) {
      return res.status(401).render("register", {
        message: 'Fill all the fields'
      });
    }
    if (results.length > 0) {
      return res.render('register', {
        message: 'That email is already in use!'
      })
    }
    // else if(password !== c_password){
    //     return res.render('register', {
    //         message : 'Passwords do not match!'
    //     })
    // }

    let h_password = await bcrypt.hash(password, 8);
    console.log(h_password);

    db.start.query('INSERT INTO students SET ?', {
      name: name,
      email: email,
      password: h_password,
      rollno: rollno,
      dob: dob,
      score: '0'
    }, (error, results) => {
      if (error) {
        console.log(error);
      } else {
        db.start.query('SELECT id FROM students WHERE email = ?', [email], (error, result) => {
          const id = result[0].id;
          console.log(id);
          const token = jwt.sign({
            id
          }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
          });

          /* const cookieOptions = {
             expires: new Date(
               Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
             ),
             httpOnly: true
           };
           res.cookie('jwt', token, cookieOptions);*/

          //res.status(201).redirect("/index");
          res.render('admin', {
            message: 'Registeration Successful'
          })
        });
      }
    });
  });
};
//register
exports.deletestudent = (req, res) => {

  console.log(req.body);
  const {
    name,
    email
  } = req.body;

  db.start.query('SELECT email FROM students WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
    }
    if (!name || !email) {
      return res.status(401).render("editStudent", {
        message: 'Fill all the fields'
      });
    }
    if (results.length <= 0) {
      //return res.render('editStudent', {
      //  message : 'Student does not exist'

      // })
      alert("Student does not exist");
    }
    /*else if(password !== c_password){
        return res.render('editStudent', {
            message : 'Passwords do not match!'
        })
    }*/

    // let h_password = await bcrypt.hash(password,8);
    // console.log(h_password);

    db.start.query('DELETE FROM students WHERE email = ?', [email], (error, results) => {
      if (error) {
        console.log(error);
      }
      /*else{
                    db.start.query('SELECT id FROM students WHERE email = ?', [email], (error, result) => {
                        const id = result[0].id;
                        console.log(id);
                        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                          expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
                        });
              
                        const cookieOptions = {
                          expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                          ),
                          httpOnly: true
                        };
                        res.cookie('jwt', token, cookieOptions);*/

      res.status(201).redirect("/viewrecords");
      // res.render('editStudent',{message : 'Registeration Successful'})
      //});
      //}
    });
  });
};
exports.registerteacher2 = (req, res) => {

  console.log(req.body);
  const {
    name,
    email,
    roll_no,
    dob,
    score
  } = req.body;


  db.start.query('SELECT email FROM students WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
    }
    if (!name || !email || !roll_no || !dob || !score) {
      return res.status(401).render("editStudent", {
        message: 'Fill all the fields'
      });
    }
    if (results.length <= 0) {
      //return res.render('editStudent', {
      //  message : 'Student does not exist'

      // })
      alert("Student does not exist");
    }
    /*else if(password !== c_password){
        return res.render('editStudent', {
            message : 'Passwords do not match!'
        })
    }*/

    // let h_password = await bcrypt.hash(password,8);
    // console.log(h_password);

    db.start.query('UPDATE students SET ? WHERE email = ?', [{
      name: name,
      rollno: roll_no,
      dob: dob,
      score: score
    }, email], (error, results) => {
      if (error) {
        console.log(error);
      }
      /*else{
                    db.start.query('SELECT id FROM students WHERE email = ?', [email], (error, result) => {
                        const id = result[0].id;
                        console.log(id);
                        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                          expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
                        });
              
                        const cookieOptions = {
                          expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                          ),
                          httpOnly: true
                        };
                        res.cookie('jwt', token, cookieOptions);*/

      res.status(201).redirect("/viewrecords");
      // res.render('editStudent',{message : 'Registeration Successful'})
      //});
      //}
    });
  });
};

exports.fetchStudentRecord = (req, res) => {
  const {
    dob,
    roll_no
  } = req.body;
  console.log(req.body);
  db.start.query('SELECT * from students WHERE rollno = ?', [roll_no], async (err, row) => {
    if (err) {
      console.log(error);
    }
    if (row) {
      if (row.rollno !== roll_no) {
        res.render('profile', {
          message: 'dob not matching',
        })
      }
      req.locals = row[0];
      console.log(row);
      res.render('result', {
        user: req.user,
        row
      })
    }
  });
}

exports.registerteacher = (req, res) => {

  console.log(req.body);
  const {
    name,
    email,
    password,
    c_password
  } = req.body;

  verifier.verify(email, function (err, info) {
    if (err) {
      return res.render('teacherregister', {
        message: 'Invalid emailx!'
      })
    } else {
      console.log("Success (T/F): " + info.success);
      console.log("Info: " + info.info);

      //Info object returns a code which representing a state of validation:

      //Connected to SMTP server and finished email verification

      //Domain not found
      if (
        info.success === true) {


        db.start.query('SELECT email FROM teachers WHERE email = ?', [email], async (error, results) => {
          if (error) {
            console.log(error);
          }
          if (!name || !email || !password || !c_password) {
            return res.status(401).render("teacherregister", {
              message: 'Fill all the fields'
            });
          }
          if (results.length > 0) {
            return res.render('teacherregister', {
              message: 'That email is already in use!'
            })
          } else if (password !== c_password) {
            return res.render('teacherregister', {
              message: 'Passwords do not match!'
            })
          }

          let h_password = await bcrypt.hash(password, 8);
          console.log(h_password);

          db.start.query('INSERT INTO teachers SET ?', {
            name: name,
            email: email,
            password: h_password
          }, (error, results) => {
            if (error) {
              console.log(error);
            } else {
              db.start.query('SELECT id FROM teachers WHERE email = ?', [email], (error, result) => {
                const id = result[0].id;
                console.log(id);
                const token = jwt.sign({
                  id
                }, process.env.JWT_SECRET, {
                  expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
                });

                /*const cookieOptions = {
                  expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
                  ),
                  httpOnly: true
                };
                res.cookie('jwt', token, cookieOptions);*/

                //res.status(201).redirect("/index");
                res.render('index', {
                  message: 'Registeration Successful'
                })
              });
            }
          });
        });
      } else {
        return res.render('teacherregister', {
          message: info.info,
        })
      }
    }
  });

};
exports.loginteacher = async (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return res.status(400).render("teacherlogin", {
      message: 'Please provide email and password'
    });
  }

  // 2) Check if user exists && password is correct
  db.start.query('SELECT * FROM teachers WHERE email = ?', [email], async (error, results) => {
    if (results == 0) {
      return res.status(401).render("teacherlogin", {
        message: 'Email does not exist'
      });
    }
    console.log(results);
    console.log(password);
    const isMatch = await bcrypt.compare(password, results[0].password);
    console.log(isMatch);
    if (!results || !isMatch) {
      return res.status(401).render("teacherlogin", {
        message: 'Incorrect email or password'
      });
    } else {
      // 3) If everything ok, send token to client
      const id = results[0].id;
      console.log(id);
      const token = jwt.sign({
        id
      }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
      });

      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
      };
      res.cookie('jwt', token, cookieOptions);
      res.render('editStudent', {
        message: 'Login Successful!'
      });
    }
  });
};
exports.loginadmin = async (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return res.status(400).render("adminlogin", {
      message: 'Please provide email and password'
    });
  }

  // 2) Check if user exists && password is correct
  db.start.query('SELECT * FROM admin WHERE email = ?', [email], async (error, results) => {
    if (results == 0) {
      return res.status(401).render("adminlogin", {
        message: 'Email does not exist'
      });
    }
    console.log(results);
    console.log(password);
    const isMatch = password === results[0].password;
    console.log(isMatch);
    if (!results || !isMatch) {
      return res.status(401).render("adminlogin", {
        message: 'Incorrect email or password'
      });
    } else {
      // 3) If everything ok, send token to client
      const id = results[0].id;
      console.log(id);
      const token = jwt.sign({
        id
      }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
      });

      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
      };
      res.cookie('jwt', token, cookieOptions);
      res.render('admin', {
        message: 'Login Successful!'
      });
    }
  });
};

exports.isLoggedInteacher = async (req, res, next) => {
  const {
    score
  } = req.body;
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      console.log(decoded);

      // 2) Check if user still exists
      db.start.query('SELECT * FROM teachers', (error, result) => {
        console.log(result)
        if (!result) {
          return next();
        }
        // THERE IS A LOGGED IN USER
        //req.user = result[0];
        req.user = result[0];

        db.start.query('SELECT * FROM students WHERE score > 0', [score], (err, row) => {
          if (!err) {
            //console.log(row);
            req.locals = row[0];
            console.log(row);
            res.render('editStudent', {
              user: req.user,
              row
            })
          } else {
            console.log(err);
          }
        });

        return next();
      });
    } catch (err) {
      return next();
    }
  } else {
    next();
  }
};

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      console.log(decoded);

      // 2) Check if user still exists
      db.start.query('SELECT * FROM students WHERE id = ?', [decoded.id], (error, result) => {
        console.log(result)
        if (!result) {
          return next();
        }
        // THERE IS A LOGGED IN USER
        //req.user = result[0];
        req.user = result[0];

        db.start.query('SELECT * FROM students WHERE id = ?', [decoded.id], (err, row) => {
          if (!err) {
            //console.log(row);
            req.locals = row[0];
            res.render('profile', {
              user: req.user,
              row
            })
          } else {
            console.log(err);
          }
        });

        return next();
      });
    } catch (err) {
      return next();
    }
  } else {
    next();
  }
};
exports.isLoggedInadmin = async (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      console.log(decoded);

      // 2) Check if user still exists
      db.start.query('SELECT * FROM admin WHERE id = ?', [decoded.id], (error, result) => {
        console.log(result)
        if (!result) {
          return next();
        }
        // THERE IS A LOGGED IN USER
        //req.user = result[0];
        req.user = result[0];

        db.start.query('SELECT * FROM admin WHERE id = ?', [decoded.id], (err, row) => {
          if (!err) {
            //console.log(row);
            req.locals = row[0];
            res.render('admin', {
              user: req.user,
              row
            })
          } else {
            console.log(err);
          }
        });

        return next();
      });
    } catch (err) {
      return next();
    }
  } else {
    next();
  }
};

//logout
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).redirect("/index");
  // window.location.assign("/index")
  // window.location.href="";
  // res.render('index',{message : 'Logout Successful'})
};

exports.view = (req, res) => {
  db.start.query('SELECT * FROM students', (err, row) => {
    if (!err) {
      console.log(row);
      req.user = row[0];
    } else {
      console.log(err);
    }
  });
}

//add rows
exports.addAF = async (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      req.user = decoded.id;

      db.start.query("SELECT * FROM course WHERE name='Africa' AND uid = ?", decoded.id, (err, res) => {
        req.user = res[0];
        if (!req.user) {
          db.start.query('INSERT INTO course SET ?', {
            uid: decoded.id,
            name: 'Africa',
            img: 'img/af.png',
            link: 'AF'
          }, (err, res) => {
            if (err) {

              console.log(err);
            }
          })
        }

      })
      return next();

    } catch (err) {
      return next();
    }
  } else {
    return next();
  }
}

exports.addAS = async (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      req.user = decoded.id;

      db.start.query("SELECT * FROM course WHERE name='Asia' AND uid = ?", decoded.id, (err, res) => {
        req.user = res[0];
        if (!req.user) {
          db.start.query('INSERT INTO course SET ?', {
            uid: decoded.id,
            name: 'Asia',
            img: 'img/as.png',
            link: 'AS'
          }, (err, res) => {
            if (err) {
              console.log(err);
            }
          })
        }
      })
      return next();

    } catch (err) {
      return next();
    }
  } else {
    return next();
  }
}

exports.addEU = async (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      req.user = decoded.id;

      db.start.query("SELECT * FROM course WHERE name='Europe' AND uid = ?", decoded.id, (err, res) => {
        req.user = res[0];
        if (!req.user) {
          db.start.query('INSERT INTO course SET ?', {
            uid: decoded.id,
            name: 'Europe',
            img: 'img/eu.png',
            link: 'EU'
          }, (err, res) => {
            if (err) {
              console.log(err);
            }
          })
        }
      })
      return next();

    } catch (err) {
      return next();
    }
  } else {
    return next();
  }
}

exports.addNA = async (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      req.user = decoded.id;

      db.start.query("SELECT * FROM course WHERE name='North America' AND uid = ?", decoded.id, (err, res) => {
        req.user = res[0];
        if (!req.user) {
          db.start.query('INSERT INTO course SET ?', {
            uid: decoded.id,
            name: 'North America',
            img: 'img/na.png',
            link: 'NA'
          }, (err, res) => {
            if (err) {
              console.log(err);
            }
          })
        }
      })
      return next();

    } catch (err) {
      return next();
    }
  } else {
    return next();
  }
}

exports.addOC = async (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      req.user = decoded.id;

      db.start.query("SELECT * FROM course WHERE name='Oceania' AND uid = ?", decoded.id, (err, res) => {
        req.user = res[0];
        if (!req.user) {
          db.start.query('INSERT INTO course SET ?', {
            uid: decoded.id,
            name: 'Oceania',
            img: 'img/oc.png',
            link: 'OC'
          }, (err, res) => {
            if (err) {
              console.log(err);
            }
          })
        }
      })
      return next();

    } catch (err) {
      return next();
    }
  } else {
    return next();
  }
}

exports.addSA = async (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      req.user = decoded.id;

      db.start.query("SELECT * FROM course WHERE name='South America' AND uid = ?", decoded.id, (err, res) => {
        req.user = res[0];
        if (!req.user) {
          db.start.query('INSERT INTO course SET ?', {
            uid: decoded.id,
            name: 'South America',
            img: 'img/sa.png',
            link: 'SA'
          }, (err, res) => {
            if (err) {
              console.log(err);
            }
          })
        }
      })
      return next();

    } catch (err) {
      return next();
    }
  } else {
    return next();
  }
}


//delete rows
exports.delAF = async (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      req.user = decoded.id;
      db.start.query("DELETE FROM course WHERE name = 'Africa' AND uid = ?", decoded.id, (err, res) => {
        if (err) {
          console.log(err);
        }
      })
      return next();

    } catch (err) {
      return next();
    }
  } else {
    return next();
  }
}

exports.delAS = async (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      req.user = decoded.id;
      db.start.query("DELETE FROM course WHERE name = 'Asia' AND uid = ?", decoded.id, (err, res) => {
        if (err) {
          console.log(err);
        }
      })
      return next();

    } catch (err) {
      return next();
    }
  } else {
    return next();
  }
}

exports.delEU = async (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      req.user = decoded.id;
      db.start.query("DELETE FROM course WHERE name = 'Europe' AND uid = ?", decoded.id, (err, res) => {
        if (err) {
          console.log(err);
        }
      })
      return next();

    } catch (err) {
      return next();
    }
  } else {
    return next();
  }
}

exports.delNA = async (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      req.user = decoded.id;
      db.start.query("DELETE FROM course WHERE name = 'North America' AND uid = ?", decoded.id, (err, res) => {
        if (err) {
          console.log(err);
        }
      })
      return next();

    } catch (err) {
      return next();
    }
  } else {
    return next();
  }
}

exports.delOC = async (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      req.user = decoded.id;
      db.start.query("DELETE FROM course WHERE name = 'Oceania' AND uid = ?", decoded.id, (err, res) => {
        if (err) {
          console.log(err);
        }
      })
      return next();

    } catch (err) {
      return next();
    }
  } else {
    return next();
  }
}

exports.delSA = async (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      req.user = decoded.id;
      db.start.query("DELETE FROM course WHERE name = 'South America' AND uid = ?", decoded.id, (err, res) => {
        if (err) {
          console.log(err);
        }
      })
      return next();

    } catch (err) {
      return next();
    }
  } else {
    return next();
  }
}