import "./styles.css";
import "./manage.css";
import WithPillbox from "./Pillbox";
import TrafficShaperVPN from "./TrafficShaperVPN";

export default function App() {
  const Pillbox = WithPillbox(TrafficShaperVPN);
  return (
    <div className="App">
      <Pillbox />
    </div>
  );
}
