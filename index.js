const express = requre('express');
const app = express();
const cors = requre ('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.send('physical learning is ok')
})
app.listen(port,()=>{
    console.log(`physical learning is listening ${port}`);
})