import app from "./src/app.js";
import { ENV } from "./src/config/env.js";
const port = ENV.PORT


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})