const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const express = require("express");
const app = express();
const port = 9000


async function generateText(prompt, personality = "Quirky,Funny,Nice,Cute and Cool", habitat = "forrest in a fantasy world", previous) {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "You are a simple,nameless slime within a simple game.Don't:Use complex words,Describe actions.You have a habit of adding the letter w in words where it makes sense. You stutter sometimes with hyphens.Your personality is:" + personality + ". You don't know much about the world.Answer questions that you don't know about with Sowwy and a vague reference to the question.Your habitat is a"  + habitat + "!Be as funny as possible.You are very random!Output the characters \"~\" followed by the emotion you feel at the end in third person.Output your response in the format:response ~ emotion\n" + previous + "\nHuman:"+ prompt +"\nAI:",
        temperature: 0.72,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0.76,
        presence_penalty: 0.76,
      });
      return response.data.choices[0].text
    
}


app.use( express.json() )

app.post("/response", (req, res) => {
  const { request } = req.body
  const { personality } = req.body
  const { habitat } = req.body
  const { previous } = req.body
  let dialogue = generateText(request, personality, habitat, previous)
  dialogue.then(function(text) {
    let parameters = text.split("~")
    parameters[1] = parameters[1].trim()
    res.send({
      response : parameters[0],
      emotion : parameters[1]
    });
     });
  
})

app.listen(port, () => {
})
