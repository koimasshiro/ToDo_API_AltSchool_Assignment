const task = require("../model/task");
const user = require("../model/user");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

const authGuard = async (req, res, next) => {
  try {
    let token;
    token = req.cookies.token;
    if (!token) {
      console.log("No token found. Redirecting to login.");
      res.redirect("/login");
    }
    const decoded = jwt.verify(token, "idontlikebread");
    req.user = await user.findOne({ _id: decoded.user_id });
    next();
  } catch (error) {
    console.error(error);
    console.log(req.cookies);
    res.redirect("/login");
  }
};

//Login Route

router.get("/login", (req, res, next) => {
  console.log("Rendering login page.");
  res.render("login");
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const findUser = await user.findOne({ username, password });
    const token = jwt.sign(
      {
        user_id: findUser._id,
      },
      "idontlikebread"
    );
    console.log(token);
    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(200).cookie("token", token, options).redirect("/home");
  } catch (error) {
    console.log(error);
    res.send("Error In Creation, Either Duplicate Or invalid input");
  }
});

//Register Route
router.get("/register", (req, res, next) => {
  console.log("Rendering register page.");
  res.render("register");
});

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const newUser = await user.create({ username, password });
    const token = jwt.sign(
      {
        user_id: newUser._id,
      },
      "idontlikebread"
    );
    console.log("Login successful. Token:", token);
    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(201).cookie("token", token, options).redirect("/home");
  } catch (error) {
    console.log(error);
    res.send("Error In Creation, Either Duplicate Or invalid input");
  }
});

//Logout Route
router.get("/logout", (req, res) => {
  // Clear the token cookie
  res.clearCookie("token");

  // Redirect to the login page
  res.redirect("/login");
});

//Create a new task route
router.get("/create", authGuard, (req, res, next) => {
  res.render("create");
});

router.post("/create", authGuard, async (req, res, next) => {
  try {
    const { body } = req.body;
    if (!body) {
      return res.send("Not a valid Body");
    }
    await task.create({
      body,
      user: req.user._id,
      done: false,
    });
    res.redirect("/home");
  } catch (error) {
    console.log(error);
    res.send("An Error Occured");
  }
});

//Toggler Route
router.get("/toggle/:id", authGuard, async (req, res, next) => {
  try {
    const t = await task.findOne({ _id: req.params.id });
    t.done = !t.done;
    // t.done = true;
    await t.save();
    res.redirect("/home");
  } catch (error) {
    console.log(error);
    res.send("Crazy things are happening!!");
  }
});

//Edit Route

router.get("/edit/:id", authGuard, async (req, res, next) => {
  try {
    const t = await task.findOne({ _id: req.params.id });
    res.render("edit", { t });
  } catch (error) {
    console.log(error);
    res.send("Crazy things are happening!!");
  }
});

router.post("/edit/:id", authGuard, async (req, res, next) => {
  try {
    const t = await task.findOne({ _id: req.params.id });
    t.body = req.body.body;
    await t.save();
    res.redirect("/home");
  } catch (error) {
    console.log(error);
    res.send("Crazy things are happening!!");
  }
});

//Home Route
router.get("/home", authGuard, async (req, res, next) => {
  try {
    const tasks = await task.find({ user: req.user._id });
    res.render("home", { tasks });
  } catch (error) {
    console.log(error);
    res.send("Crazy things are happening!!");
  }
});

//Delete Route

router.get("/delete/:id", authGuard, async (req, res, next) => {
  try {
    const t = await task.findOne({ _id: req.params.id });
    res.render("delete", { t });
  } catch (error) {
    console.log(error);
    res.send("Crazy things are happening!!");
  }
});

router.post("/delete/:id", authGuard, async (req, res, next) => {
  try {
    const t = await task.findOne({ _id: req.params.id });
    await task.deleteOne({ _id: t });
    res.redirect("/home");
  } catch (error) {
    console.log(error);
    res.send("An error occurred while deleting the task.");
  }
});

router.get("/", authGuard, (req, res, next) => {
  res.redirect("/home");
});

module.exports = router;
