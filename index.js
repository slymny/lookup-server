import express from 'express';
import router from './router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 5000;

app.use('/weather/', router);

app.use(express.static('public'));

app.get('/', (req, res) => {
  const d = new Date();
  res.json({currentTime: d.toTimeString()});
  console.log('Received a GET request');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
