import React from "react";
const uplinkOptions = [
  "WAN 1",
  "WAN 2",
  "Best for VoIP",
  "Load Balance",
  "Global Preference"
];
const failOverOptions = ["Poor performance", "Uplink Down"];
const performanceClassOptions = ["VoIP"];
export default class UplinkSelectionPolicy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uplink: uplinkOptions[0],
      failOver: failOverOptions[0],
      forPerformanceClass: performanceClassOptions[0]
    };
  }
  render() {
    const { uplink, failOver, forPerformanceClass } = this.state;
    return (
      <div className="trafficShaperVPN-row">
        <div className="chosen-container-single" style={{ width: "70%" }}>
          <label>
            Preferred uplink
            <select
              className="protocol chosen-single"
              style={{ width: "100%" }}
              value={uplink}
              onChange={(evt) => {
                this.setState({ uplink: evt.target.value });
              }}
            >
              {uplinkOptions.map((o) => (
                <option value={o}>{o}</option>
              ))}
            </select>
          </label>
        </div>
        {["WAN 1", "WAN 2", "Load Balance"].indexOf(uplink) !== -1 && (
          <>
            <div className="chosen-container-single" style={{ width: "70%" }}>
              <label>
                Fail over if:
                <select
                  className="protocol chosen-single"
                  style={{ width: "100%" }}
                  value={failOver}
                  onChange={(evt) => {
                    this.setState({ failOver: evt.target.value });
                  }}
                >
                  {failOverOptions.map((o) => (
                    <option value={o}>{o}</option>
                  ))}
                </select>
              </label>
            </div>
            {failOver === "Poor performance" && (
              <div className="chosen-container-single" style={{ width: "70%" }}>
                <label>
                  On uplinks that meet performance class:
                  <select
                    className="protocol chosen-single"
                    style={{ width: "100%" }}
                    value={forPerformanceClass}
                    onChange={(evt) => {
                      this.setState({ forPerformanceClass: evt.target.value });
                    }}
                  >
                    {performanceClassOptions.map((o) => (
                      <option value={o}>{o}</option>
                    ))}
                  </select>
                </label>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}
