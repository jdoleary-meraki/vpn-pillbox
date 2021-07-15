import React from "react";
export const uplinkOptions = [
  "WAN 1",
  "WAN 2",
  "Best for VoIP",
  "Load Balance",
  "Global Preference"
];
export const failOverOptions = ["Poor performance", "Uplink Down"];
export const performanceClassOptions = ["VoIP"];
export default class UplinkSelectionPolicy extends React.Component {
  render() {
    const { onChange, value } = this.props;
    const { uplink, fail_over, performance_category } = value;
    return (
      <div className="trafficShaperVPN-row">
        <h3>Policy</h3>
        <div className="chosen-container-single" style={{ width: "70%" }}>
          <label>
            Preferred uplink
            <select
              className="protocol chosen-single"
              style={{ width: "100%" }}
              value={uplink}
              onChange={(evt) => {
                onChange({ uplink: evt.target.value });
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
            <div
              className="chosen-container-single trafficShaperVPN-row"
              style={{ width: "70%" }}
            >
              <label>
                Fail over if:
                <select
                  className="protocol chosen-single"
                  style={{ width: "100%" }}
                  value={fail_over}
                  onChange={(evt) => {
                    onChange({ fail_over: evt.target.value });
                  }}
                >
                  {failOverOptions.map((o) => (
                    <option value={o}>{o}</option>
                  ))}
                </select>
              </label>
            </div>
            {fail_over === "Poor performance" && (
              <div
                className="chosen-container-single trafficShaperVPN-row"
                style={{ width: "70%" }}
              >
                <label>
                  On uplinks that meet performance class:
                  <select
                    className="protocol chosen-single"
                    style={{ width: "100%" }}
                    value={performance_category}
                    onChange={(evt) => {
                      onChange({ performance_category: evt.target.value });
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
