import { eq } from "drizzle-orm";
import { dbClient, dbConn } from "@db/client.js";
import { todoTable, usersTable } from "@db/schema.js";
import bcrypt from "bcryptjs";

/*
async function insertData() {
  await dbClient.insert(todoTable).values({
    todoText: "Finish reading",
  });
  dbConn.end();
}*/
async function insertData() {
  try {
    await dbClient.insert(todoTable).values({
      todoText: "Finish reading",
      ownerId: "62650a87-ed5c-4a09-b84a-7c478d72a79d", // valid user ID from usersTable
    });
    console.log("Todo inserted successfully");
  } catch (err) {
    console.error("Error inserting todo:", err);
  }
}

async function queryData() {
//   dbClient.query.todoTable.findMany({
//     where
//   })
  const results = await dbClient.query.todoTable.findMany();
  console.log(results);
  dbConn.end();
}

async function updateData() {
  const results = await dbClient.query.todoTable.findMany();
  if (results.length === 0) dbConn.end();

  const id = results[0].id;
  await dbClient
    .update(todoTable)
    .set({
      todoText: "AAA",
    })
    .where(eq(todoTable.id, id));
  dbConn.end();
}

async function deleteData() {
  const results = await dbClient.query.todoTable.findMany();
  if (results.length === 0) dbConn.end();

  const id = results[0].id;
  await dbClient.delete(todoTable).where(eq(todoTable.id, id));
  dbConn.end();
}

async function insertUser() {
  const plainPassword = "1234";
  // Hash รหัสผ่านด้วย bcrypt
  const passwordHash = await bcrypt.hash(plainPassword, 10); // 10 = salt rounds
  // Insert ลง usersTable
  await dbClient.insert(usersTable).values({
    email: "testuser@example.com",
    username: "testuser",
    passwordHash,
  });
  console.log("Inserted user!");
  dbConn.end();
}

async function queryUsers() {
  const users = await dbClient.query.usersTable.findMany();
  console.log(users);
  dbConn.end();
}

// insertData();
// queryData();
// updateData();
// deleteData();
insertUser();
queryUsers();