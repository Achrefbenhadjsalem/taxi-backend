const sequelize = require('./config');
const User = require('./models/User');
const Trip = require('./models/Trip');
const Message=require('./models/Message');


sequelize.sync({ force: true })
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });