const fs = require("fs-extra");

module.exports.config = {
 name: "help",
 version: "5.2.0",
 hasPermssion: 0,
 credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
 description: "Shows all commands with details",
 commandCategory: "system",
 usages: "[command name]",
 cooldowns: 5
};

const OWNER = "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐";

// 🔠 Font Converter
function toBold(text) {
 const boldMap = {
 'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶',
 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽',
 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄',
 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
 'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐',
 'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗',
 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞',
 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',
 '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺',
 '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿'
 };
 return String(text).split('').map(ch => boldMap[ch] || ch).join('');
}

function getPrefix(threadID) {
 const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
 return threadSetting.PREFIX || global.config.PREFIX || "";
}

// ⏱️ আপটাইম ফরম্যাট
function getUptime() {
 const t = Math.floor(process.uptime());
 const d = Math.floor(t / 86400);
 const h = Math.floor((t % 86400) / 3600);
 const m = Math.floor((t % 3600) / 60);
 const s = t % 60;
 return `${d}d ${h}h ${m}m ${s}s`;
}

module.exports.languages = {
 "en": {
 "moduleInfo": `╔══════════════════════╗
║ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ✨ ║
╠══════════════════════╣
║
║ 🔖 𝐍𝐚𝐦𝐞 ⇢ %1
║ 📄 𝐔𝐬𝐚𝐠𝐞 ⇢ %2
║ 📜 𝐃𝐞𝐬𝐜 ⇢ %3
║ 🔑 𝐏𝐞𝐫𝐦 ⇢ %4
║ 👨‍💻 𝐂𝐫𝐞𝐝𝐢𝐭 ⇢ %5
║ 📂 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲⇢ %6
║ ⏳ 𝐂𝐨𝐨𝐥𝐝𝐨𝐰𝐧⇢ %7s
║
╠══════════════════════╣
║ ⚙ 𝐏𝐫𝐞𝐟𝐢𝐱 ⇢ %8
║ 🤖 𝐁𝐨𝐭 ⇢ %9
║ 👑 𝐎𝐰𝐧𝐞𝐫 ⇢ ${OWNER}
╚══════════════════════╝`
 }
};

// 📦 কমান্ডের ইনফো টেক্সট
function buildDetail(getText, command, prefix) {
 return getText("moduleInfo",
 toBold(command.config.name),
 toBold(command.config.usages || "Not Provided"),
 toBold(command.config.description || "Not Provided"),
 toBold(command.config.hasPermssion),
 toBold(command.config.credits || "Unknown"),
 toBold(command.config.commandCategory || "Unknown"),
 toBold(command.config.cooldowns || 0),
 toBold(prefix || "no-prefix"),
 toBold(global.config.BOTNAME || OWNER)
 );
}

// ✂️ ছোট টুকরোয় ভাগ করে ক্রমানুসারে পাঠাবে
function sendLong(api, lines, threadID, messageID) {
 const LIMIT = 3000;
 const chunks = [];
 let cur = "";
 for (const line of lines) {
 if (cur && (cur + "\n" + line).length > LIMIT) {
 chunks.push(cur);
 cur = line;
 } else {
 cur = cur ? cur + "\n" + line : line;
 }
 }
 if (cur) chunks.push(cur);

 const sendNext = (i) => {
 if (i >= chunks.length) return;
 api.sendMessage(chunks[i], threadID, () => sendNext(i + 1), i === 0 ? messageID : undefined);
 };
 sendNext(0);
}

// 🎯 Prefix ছাড়া "help <command>" ডিটেক্ট
module.exports.handleEvent = function ({ api, event, getText }) {
 const { commands } = global.client;
 const { threadID, messageID, body } = event;
 if (!body) return;

 const lowerBody = body.trim().toLowerCase();
 const prefix = global.config.PREFIX || "";
 let args = null;

 if (lowerBody.startsWith(prefix.toLowerCase() + "help ")) {
 args = body.trim().slice(prefix.length).trim().split(/\s+/).slice(1);
 } else if (lowerBody.startsWith("help ")) {
 args = body.trim().split(/\s+/).slice(1);
 } else {
 return;
 }

 if (!args[0] || !commands.has(args[0].toLowerCase())) return;

 const command = commands.get(args[0].toLowerCase());
 const detail = buildDetail(getText, command, getPrefix(threadID));
 return api.sendMessage(detail, threadID, undefined, messageID);
};

module.exports.run = function ({ api, event, args, getText }) {
 const { commands } = global.client;
 const { threadID, messageID } = event;
 const prefix = getPrefix(threadID);

 // 🔍 নির্দিষ্ট কমান্ডের তথ্য
 if (args[0] && commands.has(args[0].toLowerCase())) {
 const command = commands.get(args[0].toLowerCase());
 const detail = buildDetail(getText, command, prefix);
 return api.sendMessage(detail, threadID, undefined, messageID);
 }

 // 📋 সব কমান্ড একসাথে
 const allCommands = Array.from(commands.keys())
 .filter(cmdName => cmdName && cmdName.trim() !== "")
 .sort();

 const list = allCommands.map((cmdName, i) => {
 const num = toBold(String(i + 1).padStart(3, "0"));
 return `║ ${num} ➤ ${toBold(cmdName)}`;
 });

 const header = `╔══════════════════════╗
║ 📜 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 📜 ║
╠══════════════════════╣`;

 const footer = `╠══════════════════════╣
║ 🧮 𝐓𝐨𝐭𝐚𝐥 ⇢ ${toBold(allCommands.length)}
║ ⏱️ 𝐔𝐩𝐭𝐢𝐦𝐞 ⇢ ${toBold(getUptime())}
╠══════════════════════╣
║ ⚙ 𝐏𝐫𝐞𝐟𝐢𝐱 ⇢ ${toBold(prefix || "(no prefix)")}
║ 🤖 𝐁𝐨𝐭 ⇢ ${toBold(global.config.BOTNAME || OWNER)}
║ 👑 𝐎𝐰𝐧𝐞𝐫 ⇢ ${OWNER}
╠══════════════════════╣
║ 💡 ${toBold("help <name>")} ⇢ 𝐃𝐞𝐭𝐚𝐢𝐥𝐬
╚══════════════════════╝`;

 sendLong(api, [header, ...list, footer], threadID, messageID);
};
