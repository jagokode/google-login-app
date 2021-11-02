import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { OAuth2Client } from "google-auth-library";
import cors from "cors";
import path from "path";
const __dirname = path.resolve();

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "/dist")));
app.use(cors());

const users = [];

function upsert(array, item) {
  const i = array.findIndex((_item) => _item.email === item.email);
  if (i > -1) array[i] = item;
  else array.push(item);
}

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/build/index.html"))
);

app.post("/api/google-login", async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  // console.log(ticket);
  const { name, email, picture } = ticket.getPayload();
  upsert(users, { name, email, picture });
  res.status(201).json({ name, email, picture });
});

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Server is listening at http://localhost:${port}`)
);
