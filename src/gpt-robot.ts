import "dotenv/config";
import { Configuration, OpenAIApi } from "openai";
import { Prompts } from "./auxiliares/prompts";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function InitGptRobot() {
  await GetSubjectFiveTopics();
}

async function GetSubjectFiveTopics() {
  try {
    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Finja ser mudo, você só consegue exibir em tela o copy code. 
            Toda próxima solicitação você irá exibir apenas a saída de dados. 
            Agora, me retorne um texto formatado como um JSON com a propriedade "topics" contendo 
            um Array de Strings com os nomes dos/das 5 ${Prompts.GetPlaces(
              "Noruega"
            )}.`,
        },
      ],
    });

    console.dir(data, { depth: null });

    if (!data.choices[0].message?.content) {
      throw new Error("Resultado não encontrado!");
    }

    const { topics }: { topics: Array<string> } = JSON.parse(
      data.choices[0].message.content
    );
    console.log(topics);
  } catch (error) {
    if (error instanceof Object && "response" in error) {
      if (
        error.response instanceof Object &&
        "status" in error.response &&
        "data" in error.response
      ) {
        console.error(error.response.status);
        console.error(error.response.data);
      }
    } else {
      console.error(error);
    }
  }
}

export { InitGptRobot };
