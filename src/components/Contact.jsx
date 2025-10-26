import { useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.target);

    try {
      const res = await fetch("https://formspree.io/f/mqagapka", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (res.ok) {
        setStatus("success");
        e.target.reset();
      } else throw new Error("Form submission failed");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section id="contact">
      <div className="card-title">Contact</div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Your name" required />
        <input name="email" type="email" placeholder="Your email" required />
        <input name="subject" placeholder="Subject" required />
        <textarea name="message" placeholder="Message" required />
        <button
          type="submit"
          className="btn btn-sm"
          disabled={status === "loading"}
          aria-busy={status === "loading"}
        >
          {status === "loading" ? "Sending..." : "Send message"}
        </button>
      </form>

      {status === "success" && (
        <p className="success-msg">✅ Message sent successfully!</p>
      )}
      {status === "error" && (
        <p className="error-msg">❌ Oops, something went wrong. Try again!</p>
      )}
    </section>
  );
}
