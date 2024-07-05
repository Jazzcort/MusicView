import "./styles.css"
export default function Credit() {
    return (
        <div className="d-flex h-100 w-100 flex-column justify-content-center align-items-center m-2 p-2">
            <span className="fs-3">
                <span className="fw-bold">Front-End repo: </span>
                <a className="text-decoration-none text-black repo-link" href="https://github.com/Jazzcort/MusicView">https://github.com/Jazzcort/MusicView</a>
            </span>
            <span className="fs-3">
                <span className="fw-bold">Back-End repo: </span>
            <a className="text-decoration-none text-black repo-link" href="https://github.com/Jazzcort/MusicView-Server">https://github.com/Jazzcort/MusicView-Server</a>
            </span>
        </div>
    );
}
