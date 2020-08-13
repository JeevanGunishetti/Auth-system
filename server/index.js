const app = require("express")();
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/auth");

const NODE_PORT = process.env.NODE_PORT;
const { NODE_ENV, DATABASE_URL} = process.env;
const PORT = NODE_PORT || 8000;

const isDevelopment = NODE_ENV === "development";

if(isDevelopment)
{
  app.use(morgan("dev"));
}else{
  app.use(morgan("combines"));
}

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
      extended:true,

    })
);

if(isDevelopment){
  //app.use(cors({origin:CLIENT_URL, optionSuccessStatus:200}));
  app.use(cors());
}

app.use('/api', authRoutes);

mongoose.connect(DATABASE_URL,{
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useNewUrlParser: true
}).then(()=>{

  app.listen(PORT, ()=>{
    console.log(`DB connected and the Server is running at ${PORT} - ${NODE_ENV}`);
  });
}).catch((err) =>{
  console.log("DB connection failed", err);
});
