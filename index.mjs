import mongoose from 'mongoose';
import { getExchangeRate } from './bcvScraping.mjs';

const bcvExchangeSchema = new mongoose.Schema({
  exchange: { type: Number, required: true },
});

const BcvExchange = mongoose.model('bcvExchange', bcvExchangeSchema);

export const handler = async (event, context) => {
  try {
    const uri = 'mongodb+srv://tutigre308:6NccFAZ0rFtgYn7A@bcvcurrency.pdhuufk.mongodb.net/bcvCurrency?retryWrites=true&w=majority&appName=bcvCurrency';

    console.log('Connecting to mongo')
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });

    console.log('Getting exchange')
    const exchange = await getExchangeRate();
    if (exchange === null) {
      throw new Error('Error con la página del BCV');
    }

    console.log('SEarching and replacing new exchange.')
    const existingDocument = await BcvExchange.findOne();
    if (existingDocument) {
      existingDocument.exchange = exchange;
      await existingDocument.save();
    } else {
      await new BcvExchange({ exchange }).save();
    }

    console.log('Closing connection')
    await mongoose.connection.close();
    return { statusCode: 200 };
  } catch (error) {
    await mongoose.connection.close();
    console.log(error);
    return { statusCode: 200, body: { error } };
  }
};

