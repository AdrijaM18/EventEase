import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import organizerRoutes from './router/organizerRoutes.js';
process.env.DOTENV_CONFIG_DEBUG = 'false';
dotenv.config({ 
    silent: true,
    quiet: true,
    debug: false,
    override: true,
    processEnv: process.env 
});
const app = express();

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use('/uploads',express.static('uploads'));
app.use(express.static('public'));

app.use('/api/organizer', organizerRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})