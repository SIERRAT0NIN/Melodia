const Blob = () => {
  const blobContent = [
    {
      name: "Melodía",
      description: "Your personal music app",
      url: "/home",
      username: "Sign in with Spotify!",
      className: "linkedin",
    },
  ];

  return (
    <div>
      {blobContent.map((social, index) => (
        <div key={index} className={`square ${social.className}`}>
          <span></span>
          <span></span>
          <span></span>
          <div className="content">
            <h2>{social.name}</h2>
            <p>{social.description}</p>
            <a href={social.url} rel="noopener noreferrer">
              {social.username}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blob;
