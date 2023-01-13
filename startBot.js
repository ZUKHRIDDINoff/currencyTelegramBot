const axios = require('axios');
const {
    Telegraf
} = require('telegraf');
const currencyCodes = require('currency-codes');

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN || 'your-token';
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);


bot.start((ctx) => ctx.reply('Hi, this bot show you currencies. To use bot, send currency names(Example: USD, RUB)'))

bot.help((ctx) => ctx.reply('This bot to check currencies'))

bot.on('text', async ctx => {
    try {
        const currencyReal = currencyCodes.data.find(el => el.code == ctx.message.text.toUpperCase());
        if (!currencyReal) {
            return ctx.reply('Currency not found!');
        }
        const currencyRate = await axios.get("https://api.monobank.ua/bank/currency");
        currencyRate.data.map(el => {
            if (el.currencyCodeA == currencyReal.number) {
                ctx.reply(`
    Rate buy: ${el.rateBuy}
    Rate sell: ${el.rateSell}
    Countries currency: ${currencyReal.countries}`)
            }
        })

    } catch (error) {
        console.log(error);
    }
})
bot.launch()