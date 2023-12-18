const ProfileAvi = () => {
  return (
    <div className="ui small circular rotate reveal image">
      <img
        src="/images/wireframe/square-image.png"
        className="visible content"
        alt="Placeholder"
      />
      <img
        src="https://lh3.googleusercontent.com/a/ACg8ocJSHiyA9N1JGNlcNwI_WVLFZ1r9Qe73GvjyrVkI85Lxhcw=s288-c-no" //! User img
        className="hidden content"
        alt="Profile Avatar"
      />
    </div>
  );
};

export default ProfileAvi;
