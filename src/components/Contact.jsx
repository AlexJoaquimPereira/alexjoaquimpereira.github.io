export default function Contact({ data }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const subject = e.target.subject.value.trim();
    const message = e.target.message.value.trim();
    if (!name || !email || !message) return alert("Please complete the form.");
    const mailto = `mailto:${data.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      `Hi, I'm ${name}.\n\n${message}\n\n(Reply to: ${email})`
    )}`;
    window.location.href = mailto;
  };

  return (
    <section id="contact">
      <div className="card-title">Contact</div>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Your name" required />
        <input name="email" type="email" placeholder="Your email" required />
        <input name="subject" placeholder="Subject" required />
        <textarea name="message" placeholder="Message" required />
        <button type="submit" className="btn">
          Send message
        </button>
      </form>
    </section>
  );
}
