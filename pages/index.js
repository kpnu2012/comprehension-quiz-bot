import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();


  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      var markdown = require( "markdown" ).markdown;
      //setResult(markdown.toHTML(data.result.replace(/A/g, "<br>")));
      //setResult(data.result.replace(/A/g, "\r\n"));
      //let result = result.replace(/A/g, "B");
          //document.querySelector("#output").innerHtml = markdown.toHTML(data.result.replace(/A/g, "<br>"));
        //setResult({__html: markdown.toHTML(data.result.replace(/END/g, "\r\n").replace(/A./g, "\r\nA."))});
    setResult({__html: markdown.toHTML(data.result.replace(/END/g, "\r\n"))});
      setAnimalInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/wikiHow Circle Logo.png" className={styles.icon} />
        <h3>Create a Quiz</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            style={{width: 600, marginLeft: -150}}
            name="animal"
            placeholder="Paste article body text here."
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Generate Comprehension Quiz" />
        </form>
        <div style={{width: 600}} dangerouslySetInnerHTML={result}></div>

      </main>
    </div>
  );
}
