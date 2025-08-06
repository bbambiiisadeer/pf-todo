import "dotenv/config";
import { dbClient } from "@db/client.js";
import { todoTable, usersTable } from "@db/schema.js";
import cors from "cors";
import Debug from "debug";
import { and, eq } from "drizzle-orm";
import type { ErrorRequestHandler } from "express";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware.ts";
// import { JWT_SECRET }

const debug = Debug("pf-backend");

//Intializing the express app
const app = express();

//Middleware
app.use(morgan("dev", { immediate: false }));
app.use(helmet());
app.use(
  cors({
    // origin: false, // Disable CORS
    origin: "*", // Allow all origins
  })
);
// Extracts the entire body portion of an incoming request stream and exposes it on req.body.
app.use(express.json());

// Query
app.get("/todo", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const results = await dbClient.query.todoTable.findMany({
      where: eq(todoTable.ownerId, userId),
    });
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// GET user
app.get("/auth", async (req, res, next) => {
  try {
    const results = await dbClient.query.usersTable.findMany();
    res.json(results);
  } catch (error) {
    next(error);
  }
});

// GET /todo/owner
app.get("/todo/owner", async (req, res, next) => {
  debug("route /todo/owner called");
  console.log("route /todo/owner called");
  try {
    res.json({
      id: "660610772",
      name: "Panita Donmuang",
      course_id: "261497",
      section: "003",
    });
  } catch (err) {
    next(err);
  }
});

// Insert
app.put("/todo", authMiddleware, async (req, res, next) => {
  try {
    const ownerId = req.user?.userId;
    const todoText = req.body.todoText ?? "";
    const scheduledDate = req.body.scheduledDate ?? "";
    const scheduledTime = req.body.scheduledTime ?? "";
    if (!todoText) throw new Error("Empty todoText");
    const result = await dbClient
      .insert(todoTable)
      .values({
        todoText,
        scheduledDate: scheduledDate || null,
        scheduledTime: scheduledTime || null,
        ownerId: ownerId!,
      })
      .returning({
        id: todoTable.id,
        todoText: todoTable.todoText,
        scheduledDate: todoTable.scheduledDate,
        scheduledTime: todoTable.scheduledTime,
        ownerId: todoTable.ownerId, //not sure if it neccessary
      });
    res.json({ msg: `Insert successfully`, data: result[0] });
  } catch (err) {
    next(err);
  }
});

// Update
app.patch("/todo", authMiddleware, async (req, res, next) => {
  try {
    const ownerId = req.user?.userId;
    const id = req.body.id ?? "";
    const todoText = req.body.todoText;
    const isDone = req.body.isDone;
    const scheduledDate = req.body.scheduledDate;
    const scheduledTime = req.body.scheduledTime;
    if (!ownerId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!id) throw new Error("Missing id");
    if (
      todoText === undefined &&
      isDone === undefined &&
      scheduledDate === undefined &&
      scheduledTime === undefined
    ) {
      throw new Error("No updatable fields provided");
    }

    // Check for existence + belongs to the user
    const [existingTodo] = await dbClient.query.todoTable.findMany({
      where: and(eq(todoTable.id, id), eq(todoTable.ownerId, ownerId)),
      limit: 1,
    });

    if (!existingTodo) {
      res.status(404).json({ message: "Todo not found or access denied" });
      return;
    }
    /*const results = await dbClient.query.todoTable.findMany({
      where: eq(todoTable.id, id),
    });
    if (results.length === 0) throw new Error("Invalid id");*/

    const updateData: Partial<typeof todoTable.$inferInsert> = {};
    if (todoText !== undefined) updateData.todoText = todoText;
    if (isDone !== undefined) updateData.isDone = isDone;
    if (scheduledDate !== undefined) updateData.scheduledDate = scheduledDate;
    if (scheduledTime !== undefined) updateData.scheduledTime = scheduledTime;

    const result = await dbClient
      .update(todoTable)
      .set(updateData)
      .where(and(eq(todoTable.id, id), eq(todoTable.ownerId, ownerId)))
      .returning({
        id: todoTable.id,
        todoText: todoTable.todoText,
        isDone: todoTable.isDone,
        scheduledDate: todoTable.scheduledDate,
        scheduledTime: todoTable.scheduledTime,
      });

    res.json({ msg: `Update successfully`, data: result });
  } catch (err) {
    next(err);
  }
});

// Delete
app.delete("/todo", authMiddleware, async (req, res, next) => {
  try {
    const ownerId = req.user?.userId;
    const id = req.body.id ?? "";
    if (!id) throw new Error("Empty id");
    if (typeof ownerId !== "string") {
      throw new Error("Unauthorized");
    }

    // Verify todo exists and belongs to user
    const [existingTodo] = await dbClient.query.todoTable.findMany({
      where: and(eq(todoTable.id, id), eq(todoTable.ownerId, ownerId)),
      limit: 1,
    });

    if (!existingTodo) {
      res.status(404).json({ message: "Todo not found or access denied" });
      return;
    }

    // Check for existence if data
    /*const results = await dbClient.query.todoTable.findMany({
      where: eq(todoTable.id, id),
    });
    if (results.length === 0) throw new Error("Invalid id");*/

    await dbClient
      .delete(todoTable)
      .where(and(eq(todoTable.id, id), eq(todoTable.ownerId, ownerId)));
    res.json({
      msg: `Delete successfully`,
      data: { id },
    });
  } catch (err) {
    next(err);
  }
});

app.post("/todo/all", authMiddleware, async (req, res, next) => {
  try {
    const ownerId = req.user?.userId;
    if (!ownerId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    // Only delete todos belonging to this user
    await dbClient.delete(todoTable).where(eq(todoTable.ownerId, ownerId));
    res.json({
      msg: `Delete all rows successfully`,
      data: {},
    });
  } catch (err) {
    next(err);
  }
});

// POST user /register
app.post("/auth/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const isEmailAlreadyExist = await dbClient.query.usersTable.findMany({
      where: eq(usersTable.email, email),
    });
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }
    if (isEmailAlreadyExist.length > 0) {
      res.status(409).json({ message: "Email is already registered" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await dbClient.insert(usersTable).values({
      email,
      username: username||null,
      passwordHash: hashedPassword,
    }).returning(); // get the inserted record
    const token = jwt.sign({ 
      userId: newUser.id,
      email: newUser.email
     }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    const { passwordHash, ...userWithoutPassword } = newUser;
    res.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
});

// POST user /login
app.post("/auth/login", async (req, res, next) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET! || "my-secret-key";
    const { email, password } = req.body;
    console.log("Login payload:", email, password);
    const [foundUser] = await dbClient.query.usersTable.findMany({
      where: eq(usersTable.email, email),
      limit: 1,
    });
    if (!foundUser) {
      res.status(404).json({
        status: 404,
        success: false,
        message: "User not found",
      });
      return;
    }
    const isPasswordMatched = await bcrypt.compare(
      password,
      foundUser.passwordHash
    );
    //const isPasswordMatched = foundUser?.passwordHash === password
    if (!isPasswordMatched) {
      res.status(400).json({
        status: 400,
        success: false,
        message: "wrong password",
      });
      return;
    }
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    const token = jwt.sign(
      { userId: foundUser.id, email: foundUser.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      token,
      user: {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username,
      },
    });
  } catch (error) {
    next(error);
  }
});

// JSON Error Middleware
const jsonErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  debug(err.message);
  const errorResponse = {
    message: err.message || "Internal Server Error",
    type: err.name || "Error",
    stack: err.stack,
  };
  res.status(500).send(errorResponse);
};
app.use(jsonErrorHandler);

// Running app
const PORT = 3772;

// * Running app
app.listen(PORT, async () => {
  debug(`Listening on port ${PORT}: http://localhost:${PORT}`);
});
