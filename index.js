// Requerir algumas coisas para o funcionamento do bot.
const discord = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');

// Definir o local onde estar localizado o .env os valores.
dotenv.config({ path: './data/.env' })

// O client do bot.
const client = new discord.Client();

// Collection pra armazenar os comandos do bot.
client.commands = new discord.Collection();

// Buscar todos os eventos do bot na pasta events.
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// Buscar todas as pasta de comandos.
const commandFolders = fs.readdirSync('./commands');

// Passar a listagem de arquivos em um for.
for (const file of eventFiles) {
    // Puxar o arquivo do evento.
    const event = require(`./events/${file}`);
    // Verificar se o evento é de ação única.
    if (event.once) {
        // Evento de único gatilho.
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        // Evento de múltiplos gatilhos.
        client.on(event.name, (...args) => event.execute(...args, client));
    }
};

// Passar a listagem das pasta por um for.
for (const folder of commandFolders) {
    // Obter todo os arquivos .js de uma pasta.
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    // Passar a listagem de todo os arquivos .js por um for.
    for (const file of commandFiles) {
        // Requerir o arquivo do comando.
        const command = require(`./commands/${folder}/${file}`);
        // Salvar o nome do comando com o comando.
        client.commands.set(command.name, command);
    }
};

const prefix = '!';

client.on('message', message => {
    // Verificar se a mensagem começa com o prefixo ou se o author é bot.
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    // Slice = Remover o prefixo.
    // Trim = Pra remover espaço do final e começo.
    // Split = Transformar o content em um array.
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    
    // Shift = Obter sempre o primeiro valor do array.
    // toLowerCase = Transformar o valor em minusculo.
    const commandName = args.shift().toLowerCase();

    // Listagem dos comandos.
    const commands = client.commands;
    
    // Obter o comando pelo nome || Obter o comando pelo apelido.
    const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    // Caso o comando não exista retornar.
    if (!command) return;
    
    try {
        // Executar o comando.
        command.execute(message, args);
    } catch (error) {
        // Informar caso o comando não seja executado com sucesso.
        console.error(error);
        message.reply('Erro ao executar o comando.');
    }

});

client.login(process.env.BOT_TOKEN);
