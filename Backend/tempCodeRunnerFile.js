const app = express()
// const port = 3000
// app.use(express.json())
// // Fix for __dirname in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Serve public folder (inside Backend)
// dotenv.config({ path: path.join(__dirname, ".env") });
// app.use(express.static("Backend/public"));

// mongoose.connect(process.env.MONGO_URI, {
// }).then(() => console.log("✅ MongoDB connected"))
// .catch((err) => console.error("❌ MongoDB connection error:", err));

// const auth = (req, res, next) => {
//   const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>
//   if (!token) return res.status(401).json({ error: "No token provided" });

//   jwt.verify(token, process.env.JWT_SECRET || "secretkey", (err, decoded) => {
//     if (err) return res.status(403).json({ error: "Invalid token" });
//     req.user = { id: decoded.id, role: decoded.role  }; 
//     // ✅ make sure req.user exists
//     next();
//   });
// };

// app.get("/users", async (req, res) => {
//   try {
//     const users = await User.find({}, "_id email"); // only send required fields
//     res.json(users);
//   } catch (err) {
//     res.status(500).send("Error fetching users");
//   }
// });



// app.get("/tasks", auth, async (req, res) => {
//   try {
//     let tasks;

//     if (req.user.role === "admin") {
//       // admin → all tasks
//       tasks = await Task.find()
//         .populate("assignedTo", "email")
//         .populate("createdBy", "email");
//     } else {
//       // user → tasks he created OR assigned to him
//       tasks = await Task.find({
//         $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }]
//       })
//         .populate("assignedTo", "email")
//         .populate("createdBy", "email");
//     }

//     res.json(tasks);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// // Get only current user's tasks



// app.post("/tasks", auth, async (req, res) => {
//   try {
//     // Optional: validate assigned user exists
//     if (req.body.assignedTo) {
//       const userExists = await User.findById(req.body.assignedTo);
//       if (!userExists) {
//         return res.status(400).json({ error: "Assigned user not found" });
//       }
//     }

//     const task = new Task({
//       title: req.body.title,
//       description: req.body.description,
//       deadline: req.body.deadline,
//       priority: req.body.priority,
//       status: req.body.status,
//       createdBy: req.user.id,            // always the logged-in user
//       assignedTo: req.body.assignedTo   // optional
//     });

//     await task.save();
//        await task.populate("createdBy", "email");
//     await task.populate("assignedTo", "email");
//     res.status(201).json(task);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error creating task" });
//   }
// });



// app.put("/tasks/:id", async (req, res) => {
//   try {
//     const updateData = { ...req.body };

//     // if assignedTo is empty string, remove it
//     if (!updateData.assignedTo) {
//       delete updateData.assignedTo;
//     }

//     const updatedTask = await Task.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!updatedTask) {
//       return res.status(404).json({ message: "Task not found" });
//     }

//     res.json(updatedTask);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// app.delete("/tasks/:id",async(req,res)=>{
//     const deletedTask=await Task.findByIdAndDelete(req.params.id)
//     if(!deletedTask){
//         return res.status(404).json({message:"Task not found"})
//     }
//     res.json({message:"Task deleted successfully",deletedTask})
// })

// // for sign up
// app.post("/signup", async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//       role: "user" // ✅ force every signup to user
//     });

//     await newUser.save();
//     res.send("User registered successfully");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Signup failed");
//   }
// });

// //for login
// app.post("/login",async(req,res)=>{
//   try{
//   const{email,password}=req.body

//   //checking user
//   const user=await User.findOne({email})
//   if(!user){
//     return res.status(400).send("User not found")
//   }

//   const isMatch=await bcrypt.compare(password,user.password)
//   if(!isMatch){
//     return res.status(400).send("Invalid credentials")
//   }

//   const token=jwt.sign({id:user._id, role: user.role},process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" })
//   res.json({token})
// }catch(error){
//   res.status(500).json({message:"Login failed"})
// }
// })

// app.get("/profile",async(req,res)=>{
//   const token=req.headers["authorization"]
//   if(!token){
//     return res.status(401).send("Access denied")
//   }
//   try{
//     const decoded=jwt.verify(token,process.env.JWT_SECRET||"secretkey")
//     res.json({message:"Welcome!",userId:decoded.id})
//   }catch(error){
//     res.status(401).send("Invalid token")
//   }
// })



// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })