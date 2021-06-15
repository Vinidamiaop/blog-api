import app from "./app";

const port = process.env.APP_PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Access: http://localhost:${port}`);
});
