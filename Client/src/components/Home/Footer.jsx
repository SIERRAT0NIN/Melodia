import { Button } from "@nextui-org/react";

const Footer = () => {
  return (
    <footer className="text-black mt-4 glass-footer text-center">
      <div className="container py-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <h5>Created By:</h5>
            <p>Alberto Sierra</p>
          </div>
          <div className="col-md-6 mb-3">
            <a
              href="https://github.com/SIERRAT0NIN/Phase5-project"
              className="text-white me-2"
            >
              <Button color="primary" variant="ghost" className="m-3">
                Github
              </Button>
            </a>
            <a
              href="https://www.linkedin.com/in/sierra-alberto23/"
              className="text-white me-2"
            >
              <Button color="primary" variant="ghost">
                LinkedIn
              </Button>
            </a>
          </div>
        </div>
      </div>
      <div className="text-center py-3">
        © {new Date().getFullYear()} Melodía. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
