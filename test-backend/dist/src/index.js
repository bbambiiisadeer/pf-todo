import "dotenv/config";
import { dbClient } from "../db/client.js";
import { todoTable } from "../db/schema.js";
import cors from "cors";
import Debug from "debug";
import { eq } from "drizzle-orm";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
const debug = Debug("pf-backend");
//Intializing the express app
const app = express();
//Middleware
app.use(morgan("dev", { immediate: false }));
app.use(helmet());
app.use(cors({
    // origin: false, // Disable CORS
    origin: "*", // Allow all origins
}));
// Extracts the entire body portion of an incoming request stream and exposes it on req.body.
app.use(express.json());
// Query
app.get("/todo", async (req, res, next) => {
    try {
        const results = await dbClient.query.todoTable.findMany();
        res.json(results);
    }
    catch (err) {
        next(err);
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
    }
    catch (err) {
        next(err);
    }
});
// Insert
app.put("/todo", async (req, res, next) => {
    try {
        const todoText = req.body.todoText ?? "";
        const scheduledDate = req.body.scheduledDate ?? "";
        const scheduledTime = req.body.scheduledTime ?? "";
        if (!todoText)
            throw new Error("Empty todoText");
        const result = await dbClient
            .insert(todoTable)
            .values({
            todoText,
            scheduledDate,
            scheduledTime,
        })
            .returning({ id: todoTable.id,
            todoText: todoTable.todoText,
            scheduledDate: todoTable.scheduledDate,
            scheduledTime: todoTable.scheduledTime
        });
        res.json({ msg: `Insert successfully`, data: result[0] });
    }
    catch (err) {
        next(err);
    }
});
// Update
app.patch("/todo", async (req, res, next) => {
    try {
        const id = req.body.id ?? "";
        const todoText = req.body.todoText;
        const isDone = req.body.isDone;
        const scheduledDate = req.body.scheduledDate;
        const scheduledTime = req.body.scheduledTime;
        if (!id)
            throw new Error("Missing id");
        if (todoText === undefined &&
            isDone === undefined &&
            scheduledDate === undefined &&
            scheduledTime === undefined) {
            throw new Error("No updatable fields provided");
        }
        // Check for existence
        const results = await dbClient.query.todoTable.findMany({
            where: eq(todoTable.id, id),
        });
        if (results.length === 0)
            throw new Error("Invalid id");
        const updateData = {};
        if (todoText !== undefined)
            updateData.todoText = todoText;
        if (isDone !== undefined)
            updateData.isDone = isDone;
        if (scheduledDate !== undefined)
            updateData.scheduledDate = scheduledDate;
        if (scheduledTime !== undefined)
            updateData.scheduledTime = scheduledTime;
        const result = await dbClient
            .update(todoTable)
            .set(updateData)
            .where(eq(todoTable.id, id))
            .returning({
            id: todoTable.id,
            todoText: todoTable.todoText,
            isDone: todoTable.isDone,
            scheduledDate: todoTable.scheduledDate,
            scheduledTime: todoTable.scheduledTime,
        });
        res.json({ msg: `Update successfully`, data: result });
    }
    catch (err) {
        next(err);
    }
});
// Delete
app.delete("/todo", async (req, res, next) => {
    try {
        const id = req.body.id ?? "";
        if (!id)
            throw new Error("Empty id");
        // Check for existence if data
        const results = await dbClient.query.todoTable.findMany({
            where: eq(todoTable.id, id),
        });
        if (results.length === 0)
            throw new Error("Invalid id");
        await dbClient.delete(todoTable).where(eq(todoTable.id, id));
        res.json({
            msg: `Delete successfully`,
            data: { id },
        });
    }
    catch (err) {
        next(err);
    }
});
app.post("/todo/all", async (req, res, next) => {
    try {
        await dbClient.delete(todoTable);
        res.json({
            msg: `Delete all rows successfully`,
            data: {},
        });
    }
    catch (err) {
        next(err);
    }
});
// JSON Error Middleware
const jsonErrorHandler = (err, req, res, next) => {
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
// const PORT = process.env.PORT || 3772;
const PORT = 3772;
// * Running app
app.listen(PORT, async () => {
    debug(`Listening on port ${PORT}: http://localhost:${PORT}`);
});
