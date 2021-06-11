import app from "./app";

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Access: http://localhost:${port}`);
});