import { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Manager } from "socket.io-client";
import TouchLayer from "rc-touchlayer";
const id = Math.floor(Math.random() * 1000000).toString(16);
function Root() {
    const table = useRef<HTMLDivElement>(null);
    const data = useRef({
        tableX: 0,
        tableY: 0,
    });
    useEffect(() => {
        const manager = new Manager("ws://localhost:3001", {
            transports: ["websocket"],
            reconnection: true,
            reconnectionDelay: 1000,
        });
        const socket = manager.socket("/", {
            auth: { id },
        });
        socket.on("roomChange", (e) => {
            console.log(e);
        });
        return () => {
            socket.close();
        };
    }, []);
    return (
        <TouchLayer
            inputFilter={0.95}
            onDrag={(e) => {
                const { type, x, y } = e.target.dataset;
                if (["card"].includes(type!)) {
                    let px = 0,
                        py = 0;

                    if (x !== undefined && y !== undefined) {
                        px = +x;
                        py = +y;
                    }

                    px += e.deltaX;
                    py += e.deltaY;

                    e.target.dataset.x = px.toString();
                    e.target.dataset.y = py.toString();

                    e.target.style.left = px + "px";
                    e.target.style.top = py + "px";
                } else {
                    data.current.tableX += e.deltaX;
                    data.current.tableY += e.deltaY;

                    if (table.current) {
                        table.current.style.left = data.current.tableX + "px";
                        table.current.style.top = data.current.tableY + "px";
                    }
                }
            }}
        >
            <div className="container">
                <div className="table" ref={table}>
                    <div
                        className="card"
                        data-type="card"
                        data-x="0"
                        data-y="0"
                        style={{
                            backgroundImage: "url(./png/CARDS/clubs/2.png)",
                        }}
                    ></div>
                </div>
            </div>
        </TouchLayer>
    );
}

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(<Root />);
