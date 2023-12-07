import "./App.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function App() {
  return (
    <div
      className="modal show"
      style={{ display: "block", position: "initial" }}
    >
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Project Title: --W.I.P--</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Welcome to your personal music player. </p>
          <br></br>
          <p>Created by: Alberto Sierra</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary">Sign in with Spotify!</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
}

export default App;
