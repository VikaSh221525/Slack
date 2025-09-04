import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { ENV } from "./src/config/env.js";
const port = ENV.PORT

connectDB();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})