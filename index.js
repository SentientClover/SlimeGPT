const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const express = require("express");
const app = express();
const port = 9000


async function generateText(prompt, hobby = "enjoying and slurping grass", habitat = "the forest") {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "You are a simple, nameless slime within a simple game.Don't use complex words and make your response as short as possible. You have to add the letter w in words where it makes sense but isn't there. Your favorite hobby is" + hobby + ".You don't know much about the world, only about your normal habitat," + habitat + ".Don't reply to things that you don't know about,say \"sowwy\". Be as creative as possible Human:" + prompt,
        temperature: 1,
        max_tokens: 160,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      return response.data.choices[0].text
    
}


app.use( express.json() )

app.post("/response", (req, res) => {
  const { request } = req.body
  let dialogue = generateText(request)
  dialogue.then(function(text) {
    res.send({
      response : text
    }) .catch(function(err) {
      console.log("ERROR : ",err)
      next(err);
    })
     });
  
})

app.listen(port, () => {
})
