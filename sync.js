const sequelize = require('./config');
const User = require('./models/User');
sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });