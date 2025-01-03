import React from 'react';

const About = () => {
  return (
    <div className="about-container" style={styles.container}>
      <h1 style={styles.header}>About Us</h1>
      <p style={styles.paragraph}>
        Welcome to FriendCircle! We believe in the power of connection. Our mission is to keep you closer to your loved ones, regardless of the distance. Through our platform, you can share updates, create memories, and engage in real-time conversations securely.
      </p>
      <h2 style={styles.subheader}>FriendCircle</h2>
      <p style={styles.paragraph}>
        FriendCircle was built to provide users with a safe and seamless space to connect with their friends and family. Share moments, chat, and stay up-to-date with the people who matter most, all while maintaining control over your privacy.
      </p>
      <h2 style={styles.subheader}>What We Do</h2>
      <p style={styles.paragraph}>
        At FriendCircle, we specialize in creating secure, user-friendly social platforms. With features like real-time messaging, event organizing, and media sharing, our goal is to make staying connected easy and enjoyable.
      </p>
      <h2 style={styles.subheader}>Get In Touch</h2>
      <p style={styles.paragraph}>
        Have questions or want to collaborate? Feel free to <a href="mailto:friendcircle@example.com" style={styles.link}>contact us</a> or explore our <a href="https://github.com/friendcircle" target="_blank" rel="noreferrer" style={styles.link}>GitHub</a> for more information.
      </p>
    </div>
  );
};

const styles = {
  container: {
    margin: '50px auto',
    maxWidth: '800px',
    textAlign: 'center',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: '36px',
    marginBottom: '20px',
  },
  subheader: {
    fontSize: '28px',
    marginTop: '20px',
    marginBottom: '10px',
  },
  paragraph: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#555',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default About;
