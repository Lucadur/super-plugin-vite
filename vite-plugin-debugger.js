import esprima from "esprima";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";

export default function vitePluginDebugger(apiKey) {
  if (!apiKey) {
    throw new Error("La clé API OpenAI est manquante");
  }

  const openai = new OpenAI({ apiKey });

  return {
    name: "vite-plugin-debugger",
    transform(code, id) {
      if (!id.endsWith(".jsx") && !id.endsWith(".tsx")) return;

      try {
        esprima.parseScript(code, { jsx: true });
      } catch (error) {
        console.error(`Erreur détectée dans ${id}:`, error.message);

        const prompt = `Vous êtes un expert React. Voici l'erreur : "${error.message}". Voici le code : \n${code}`;

        return openai.chat.completions
          .create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
          })
          .then((response) => {
            const solution = response.choices[0].message.content;

            const outputDir = path.resolve("./debug-responses");
            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

            fs.writeFileSync(path.join(outputDir, "solution.txt"), solution);
            console.info(`[Debug Plugin] ${solution}`);
            return code;
          });
      }
    },
  };
}
