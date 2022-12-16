import React, { useState } from 'react'
import styles from "/styles/about.module.scss"
import Navbar from "/components/navbar.js";
import Image from "next/image"
import Link from 'next/link'
import LogoAndName from "/components/logoAndName.js";
import navStyles from "/styles/navbar.module.scss"

export default function About() {

  const questionAndAnswers = [
    {
      question: "What can I expect from this website?",
      answer: "You can expect a website which shall take care of every need you may ever have!"
    },
    {
      question: "Why should I use this website?",
      answer: "Because it's awesome!"
    },
    {
      question: "Who are we and where are we from?",
      answer: "All three of us are from the Netherlands and are as of writing studying Informatics at the University of Utrecht"
    },
    {
      question: "When was this website created?",
      answer: "This website was created on the 14th of December"
    }
  ]

  const [selected, setSelected] = useState(null)
  const toggle = i => {

    if (selected == i) {
      return setSelected(null)
    }
    setSelected(i)
  }


  const [query, setQuery] = useState({
    name: "",
    email: ""
  });

  // Update inputs value
  const handleParam = () => (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuery((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  // Form Submit function
  const formSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(query).forEach(([key, value]) => {
      formData.append(key, value);
    });
    fetch("https://getform.io/f/86767796-d723-4136-872c-5217a4668a43", {
      method: "POST",
      body: formData
    }).then(() => setQuery({ name: "", email: "", message: "" }));
  };

  return (
    <div className="everythingTogether">
      <Navbar about={true}/>
      <div className={styles.imageOfUs}>
        <Image
          src="/PictureOfUs.jpg"
          className={styles.image}
          fill
          alt="Picture of the three developers of this website"
        />

      </div>

      <figcaption className={styles.figCaption}>
        <span>Elia Jabbour (left), Hugo Krul (middle), Pepijn Uuldriks (right)</span>
      </figcaption>

      <div className={styles.wrapper}>
        <div className={styles.accordion}>
          {questionAndAnswers.map((item, i) => (
            <div key={i}>
              <div className={styles.question} onClick={() => toggle(i)}>
                <span>{item.question}</span>
                <span className={styles.operator}>
                  {selected == i ? '-' : '+'}
                </span>
              </div>
              <div className={selected == i ? `${styles.answerShow} ${styles.answer}` : styles.answer}>
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className={styles.footer}>
        <h2 className={styles.h2}>Send us a message:</h2>
        <form action="https://getform.io/f/86767796-d723-4136-872c-5217a4668a43" method="POST">
          <div>
            <input className={styles.input}
              type="text"
              name="name"
              required
              placeholder="Name"
              value={query.name}
              onChange={handleParam()}
            />
          </div>
          <div>
            <input className={styles.input}
              type="email"
              name="email"
              required
              placeholder="Email"
              value={query.email}
              onChange={handleParam()}
            />
          </div>
          <textarea className={styles.input}
            style={{ height: '160px' }}
            name="message"
            rows="5"
            cols="12"
            type="text"
            placeholder="Message"
            required
            value={query.message}
            onChange={handleParam()}
          >
          </textarea>
          <button className={styles.mainButton} type="submit">Send</button>
        </form>
      </footer>
    </div>
  )
}
