const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser=require('cookie-parser');
const routeUrls = require('./routes/routes');

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());



app.use('/', routeUrls);



app.listen(4000, () => {
    console.log("Server is running on 4000");
});
