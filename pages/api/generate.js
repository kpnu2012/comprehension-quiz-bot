import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid URL",
      }
    });
    return;
  }

  try {
    const prompt = generatePrompt(animal);
        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {role: 'user', content: prompt}
          ],
          temperature: 0.6,
          max_tokens: 1500,
        });
    res.status(200).json({ result: completion.data.choices[0].message.content});
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `I will give you the text of an article, and I want you to create a quiz to test a reader on their comprehension of the article.

  The quiz should have 3 multiple choice questions. Each should question should have the word "END" at the end of it, and there should be 3 possible answers, and each answer should have the word "END" at the end of it. Indicate which answer is correct.
  Put "END" at the end of each question and each answer.

  For example, if an article was about learning to use Tinder, the questions might look like this:
    What is one way to increase your Elo score on Tinder and get more matches? END
    a) Swipe left on every profile you see END
    b) Change your profile bio every week END
    c) Open the app every day and actively engage with others END
    Answer: c) Open the app every day and actively engage with others. END

    Why should you sometimes swipe left on Tinder? END
    a) It hurts your Elo score to always swipe right END
    b) To prevent strain in your fingers END
    c) It is a winning strategy for finding love END
    Answer: a) It hurts your Elo score to always swipe right. END

    How can you maximize your number of matches on Tinder? END
    a) Turn off your age and location filters END
    b) Set your age and location filters to exactly what you want END
    c) Only swipe right on profiles that you find very attractive END
    Answer: a) Turn off your age and location filters. END

  Here is the article text: ${capitalizedAnimal}
  Quiz:`;
}
