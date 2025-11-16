const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');

const { init } = require('./config/db');

const CalorieModel = require('./models/Calorie');


const caloriesRouter = require('./routes/calories');

const PORT = process.env.PORT || 5000;

async function start() {
  const db = await init();

  const app = express();


  app.use(cors());
  app.use(bodyParser.json());

  //This is where we link the calories routes
  app.use('/api/calories', caloriesRouter(db, CalorieModel));

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start();
