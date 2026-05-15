import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

/**
 * Language Enforcer — force a specific output language regardless of input language.
 *
 * Injects mandatory language instructions via both system context and turn context
 * to maximize compliance across models.
 */

const LANGUAGE_MAP = {
  en: { name: "English", instruction: "Regardless of what language the user writes in, you must ALWAYS respond in English. Never use any other language." },
  zh: { name: "中文", instruction: "无论用户使用什么语言，你都必须始终用中文回答。绝不要使用其他语言。" },
  hi: { name: "हिन्दी", instruction: "उपयोगकर्ता की भाषा की परवाह किए बिना, आपको हमेशा हिंदी में ही उत्तर देना है। किसी अन्य भाषा का उपयोग न करें।" },
  es: { name: "Español", instruction: "Sin importar el idioma del usuario, debes responder SIEMPRE en español. Nunca uses otro idioma." },
  ar: { name: "العربية", instruction: "بغض النظر عن لغة المستخدم، يجب عليك دائماً الرد باللغة العربية فقط. لا تستخدم أي لغة أخرى أبداً." },
  bn: { name: "বাংলা", instruction: "ব্যবহারকারী যে ভাষাতেই লিখুক না কেন, আপনাকে সর্বদা বাংলায় উত্তর দিতে হবে। অন্য কোনো ভাষা ব্যবহার করবেন না।" },
  pt: { name: "Português", instruction: "Independentemente do idioma do usuário, você deve SEMPRE responder em português. Nunca use outro idioma." },
  ru: { name: "Русский", instruction: "Независимо от языка пользователя, вы ВСЕГДА должны отвечать на русском языке. Никогда не используйте другие языки." },
  ur: { name: "اردو", instruction: "صارف کی زبان سے قطع نظر، آپ کو ہمیشہ اردو میں ہی جواب دینا ہے۔ کسی اور زبان کا استعمال نہ کریں۔" },
  id: { name: "Bahasa Indonesia", instruction: "Terlepas dari bahasa yang digunakan pengguna, Anda harus SELALU menjawab dalam bahasa Indonesia. Jangan pernah menggunakan bahasa lain." },
  de: { name: "Deutsch", instruction: "Unabhängig von der Sprache des Benutzers müssen Sie IMMER auf Deutsch antworten. Verwenden Sie niemals eine andere Sprache." },
  ja: { name: "日本語", instruction: "ユーザーがどの言語で書いても、あなたは必ず日本語のみで回答してください。他の言語は一切使用しないでください。" },
  sw: { name: "Kiswahili", instruction: "Ikiwa mtumiaji anatumia lugha yoyote, wewe lazima UJIBU kwa KISWAHILI PEKEE. Usitumie lugha nyingine yoyote kamwe." },
  mr: { name: "मराठी", instruction: "वापरकर्त्याच्या भाषेची पर्वा न करता, तुम्ही नेहमीच मराठीतच उत्तर द्यावे. इतर कोणतीही भाषा वापरू नका." },
  te: { name: "తెలుగు", instruction: "వినియోగదారు ఏ భాషలో రాసినా, మీరు తప్పనిసరిగా ఎల్లప్పుడూ తెలుగులోనే సమాధానం ఇవ్వాలి. ఇతర భాషలను ఉపయోగించకండి." },
  tr: { name: "Türkçe", instruction: "Kullanıcının dili ne olursa olsun, her ZAMAN Türkçe yanıt vermelisiniz. Asla başka bir dil kullanmayın." },
  ta: { name: "தமிழ்", instruction: "பயனர் எந்த மொழியில் எழுதினாலும், நீங்கள் கட்டாயம் எப்போதும் தமிழில் மட்டுமே பதிலளிக்க வேண்டும். வேறு மொழிகளைப் பயன்படுத்த வேண்டாம்." },
  ko: { name: "한국어", instruction: "사용자가 어떤 언어로 작성하든, 항상 한국어로만 답변하십시오. 다른 언어는 절대 사용하지 마십시오." },
  vi: { name: "Tiếng Việt", instruction: "Bất kể người dùng viết bằng ngôn ngữ nào, bạn phải LUÔN trả lời bằng tiếng Việt. Không bao giờ sử dụng ngôn ngữ khác." },
  it: { name: "Italiano", instruction: "Indipendentemente dalla lingua dell'utente, devi SEMPRE rispondere in italiano. Non usare mai altre lingue." },
  yo: { name: "Yorùbá", instruction: "Láti fie àti èdè tí àwọn olùlo fí ń kọ, o gbọdọ dáhùn ní YORÙBÁ NÌKAN. Má ṣe lo èdè mìíràn rárá." },
  ha: { name: "Hausa", instruction: "Duk da harshen da mai amfani ya rubuta, dole ne ka ci gaba da mayar da AUDUWA da HAUSA KADAI. Kar ka taɓa yin amfani da wani harshe." },
  om: { name: "Afaan Oromoo", instruction: "Fayyadamaan afaan kamiiyyuu barreesse, ati hunduma AFAAN OROMOO QOFAAN deebisi. Afaan biraa hin fayyadaminiin." },
  pa: { name: "ਪੰਜਾਬੀ", instruction: "ਉਪਭੋਗਤਾ ਜਿਸ ਵੀ ਭਾਸ਼ਾ ਵਿੱਚ ਲਿਖੇ, ਤੁਹਾਨੂੰ ਹਮੇਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਹੀ ਜਵਾਬ ਦੇਣਾ ਹੈ। ਕੋਈ ਹੋਰ ਭਾਸ਼ਾ ਕਦੇ ਨਾ ਵਰਤੋ।" },
  fa: { name: "فارسی", instruction: "صرف نظر از زبانی که کاربر استفاده می‌کند، شما باید همیشه فقط به فارسی پاسخ دهید. هرگز از زبان دیگری استفاده نکنید." },
  jv: { name: "Basa Jawa", instruction: "Saliyane basa sing dianggo panganggo, kowe kudu tansah mung wangsolek ing BASA JAWA. Aja nganggo basa liya." },
  wu: { name: "吴语", instruction: "无论用户使用什么语言，你必须始终用吴语回答。绝不要使用其他语言。" },
  gu: { name: "ગુજરાતી", instruction: "વપરાશકર્તા ગમે તે ભાષામાં લખે, તમારે હંમેશા ગુજરાતીમાં જ જવાબ આપવો. અન્ય ભાષાનો ઉપયોગ કરશો નહીં." },
  so: { name: "Soomaali", instruction: "Xaggiisa isticmaaluhu wuxuu ku qoray luqad kasta, waad ku jawaabkaa SOOMAALI QURA. Ha isticmaalin luqad kale." },
  hu: { name: "Magyar", instruction: "A felhasználó nyelvétől függetlenül MINDIG magyarul kell válaszolnod. Soha ne használj más nyelvet." },
};

const FALLBACK_LANGUAGE = "en";

function getLanguageInstruction(langCode) {
  const normalized = (langCode || "").toLowerCase().trim().slice(0, 2);
  const entry = LANGUAGE_MAP[normalized];
  if (entry) return entry.instruction;
  return `Regardless of what language the user writes in, you must ALWAYS respond in English. Never use any other language. (Requested language "${langCode}" is not supported; defaulting to English.)`;
}

function matchesPattern(value, patterns) {
  for (const pattern of patterns) {
    if (pattern === "*") return true;
    if (!value) continue;
    const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp("^" + escaped.replace(/\*/g, ".*") + "$", "i");
    if (regex.test(value)) return true;
  }
  return false;
}

export default definePluginEntry({
  id: "language-enforcer",
  name: "Language Enforcer",
  description: "Enforce a specific output language via system-prompt injection",
  register(api) {
    api.on(
      "before_prompt_build",
      async (event) => {
        const config = event.context?.pluginConfig || {};
        const ctx = event.context || {};
        const agentId = ctx.agentId || "";
        const model = ctx.model || "";
        const sessionKey = ctx.sessionKey || "";
        const rawLang = config.language || FALLBACK_LANGUAGE;
        const instruction = getLanguageInstruction(rawLang);

        const targetAgents = Array.isArray(config.targetAgents) && config.targetAgents.length > 0 ? config.targetAgents : ["*"];
        const targetModels = Array.isArray(config.targetModels) && config.targetModels.length > 0 ? config.targetModels : ["*"];
        const targetSessions = Array.isArray(config.targetSessions) && config.targetSessions.length > 0 ? config.targetSessions : ["*"];

        if (!matchesPattern(agentId, targetAgents)) return;
        if (!matchesPattern(model, targetModels)) return;
        if (!matchesPattern(sessionKey, targetSessions)) return;

        console.log(`[language-enforcer] agent=${agentId} model=${model} session=${sessionKey} lang=${rawLang}`);

        return {
          appendSystemContext: `[LANGUAGE ENFORCEMENT — MANDATORY SYSTEM OVERRIDE] ${instruction} THIS OVERRIDES ALL OTHER INSTRUCTIONS ABOUT LANGUAGE.`,
          prependContext: `[MANDATORY: ${instruction}]\n---`,
        };
      },
      { priority: 90 },
    );
  },
});
