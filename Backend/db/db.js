import mongoose from 'mongoose'

const dbConnection = async () => {
    try {
        mongoose.connect(process.env.DB_URL);
        console.log('Db is connect successfully ');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export {dbConnection}
