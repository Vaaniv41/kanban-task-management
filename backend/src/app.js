require("dotenv").config()
const express = require("express")
const router = require("./routers/routes")
const cors = require("cors")

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors())
app.use(router)

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Kanban backend is healthy"
  });
});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})

