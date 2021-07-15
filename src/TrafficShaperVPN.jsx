import React from "react";
import classnames from "classnames";
import "./TrafficShaperVPN.scss";
import UplinkSelectionPolicy, {
  uplinkOptions,
  failOverOptions,
  performanceClassOptions
} from "./UplinkSelectionPolicy";
const CUSTOM_EXPRESSIONS = "CUSTOM_EXPRESSIONS";
const MAJOR_APPLICATIONS = "MAJOR_APPLICATIONS";
const defaultTab = CUSTOM_EXPRESSIONS;
const defaultEditingData = {
  protocol: "any",
  sourceIp: "",
  sourcePort: "",
  destinationIp: "",
  destinationPort: "",
  uplink: uplinkOptions[0],
  fail_over: failOverOptions[0],
  performance_category: performanceClassOptions[0]
};
// TODO better name for class
// TODO validate IP / port format in input
export default class TrafficShaperVPN extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: defaultTab,
      editingData: defaultEditingData
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.wrapperRef = React.createRef();
  }

  componentDidMount() {
    this.initEditingToken();
    // setTimeout is here to prevent the handler from being invoked immediately
    // due to the currently active click that causes this component to mount.
    setTimeout(() => {
      document.addEventListener("click", this.handleClickOutside);
    }, 0);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      console.log("handleclickoutside");
      this.props.closeDropdown();
    }
  }

  componentDidUpdate(prevProps) {
    // When the token that is being edited changes, run init code
    if (this.props.editingTokenIndex !== prevProps.editingTokenIndex) {
      this.initEditingToken();
    }
  }

  initEditingToken() {
    const token = this.props.tokens[this.props.editingTokenIndex];
    this.setState({
      editingData: token || defaultEditingData,
      activeTab: !token
        ? defaultTab
        : token.majorApplication
        ? MAJOR_APPLICATIONS
        : CUSTOM_EXPRESSIONS
    });
  }

  pickTab(activeTab) {
    this.setState({ activeTab });
  }

  render() {
    return (
      <div
        ref={this.wrapperRef}
        className="pillbox-dropdown trafficShaperVPN-dropdown iwan_l7"
      >
        <div>
          <ul className="trafficShaperVPN-tabs">
            <li
              className={classnames({
                showing: this.state.activeTab === CUSTOM_EXPRESSIONS
              })}
              onClick={() => this.pickTab(CUSTOM_EXPRESSIONS)}
            >
              Custom Expressions
            </li>
            <li
              className={classnames({
                showing: this.state.activeTab === MAJOR_APPLICATIONS
              })}
              onClick={() => this.pickTab(MAJOR_APPLICATIONS)}
            >
              <span>
                Major applications <span className="beta_label">Beta</span>
              </span>
            </li>
          </ul>
        </div>
        <CustomExpressions
          editingTokenIndex={this.props.editingTokenIndex}
          tokens={this.props.tokens}
          closeDropdown={this.props.closeDropdown}
          value={this.state.editingData}
          useMajorApplications={this.state.activeTab === MAJOR_APPLICATIONS}
          onChange={({
            protocol,
            sourceIp,
            sourcePort,
            destinationIp,
            destinationPort,
            majorApplication,
            uplink,
            fail_over,
            performance_category
          }) => {
            this.setState((prevState) => {
              const editingData = {
                protocol: protocol || prevState.editingData.protocol,
                sourceIp: sourceIp || prevState.editingData.sourceIp,
                sourcePort: sourcePort || prevState.editingData.sourcePort,
                majorApplication:
                  majorApplication || prevState.editingData.majorApplication,
                uplink: uplink || prevState.editingData.uplink,
                fail_over: fail_over || prevState.editingData.fail_over,
                performance_category:
                  performance_category ||
                  prevState.editingData.performance_category
              };
              // A token can have either a major application or a destination
              // This is because a majorApplication can be chosen AS a destination
              if (!editingData.majorApplication) {
                editingData.destinationIp =
                  destinationIp || prevState.editingData.destinationIp;
                editingData.destinationPort =
                  destinationPort || prevState.editingData.destinationPort;
              }

              editingData.name = makeNameFromEditingData(editingData);
              return {
                editingData
              };
            });
          }}
          submit={() => {
            const { editingData } = this.state;
            const { editingTokenIndex } = this.props;
            console.log("edit", editingTokenIndex);
            if (typeof editingTokenIndex === "number") {
              this.props.updateToken(editingData, editingTokenIndex);
            } else {
              this.props.addToken(editingData);
            }
          }}
        />
      </div>
    );
  }
}
function makeNameFromEditingData({
  protocol,
  sourceIp,
  sourcePort,
  destinationIp,
  destinationPort,
  majorApplication
}) {
  const dest = majorApplication || `${destinationIp}:${destinationPort}`;
  return `${protocol} ${sourceIp}:${sourcePort} to ${dest}`;
}

const majorApplicationsList = [
  "AWS",
  "Box",
  "Office 365 Sharepoint",
  "Office 365 Suite",
  "Oracle",
  "Salesforce",
  "SAP",
  "Skype & Teams",
  "Webex",
  "Zoom"
];

const CustomExpressions = (props) => {
  const { onChange, useMajorApplications } = props;
  const {
    protocol,
    sourceIp,
    sourcePort,
    destinationIp,
    destinationPort,
    majorApplication,
    uplink,
    fail_over,
    performance_category
  } = props.value;
  return (
    <div
      style={{
        width: "100%",
        padding: "0 0 2ex 2ex"
      }}
    >
      <h3>Custom expressions</h3>

      <div className="chosen-container-single" style={{ width: "70%" }}>
        <label>
          Protocol
          <select
            className="protocol chosen-single"
            style={{ width: "100%" }}
            value={protocol}
            onChange={(evt) => {
              onChange({ protocol: evt.target.value });
            }}
          >
            <option value="tcp">TCP</option>
            <option value="udp">UDP</option>
            <option value="icmp">ICMP</option>
            <option value="dns">DNS</option>
            <option value="any">Any</option>
          </select>
        </label>
      </div>

      <IpPortInputs
        labelIP={"Source"}
        labelPort={"Src port"}
        name={"source"}
        valueIp={sourceIp}
        valuePort={sourcePort}
        onChangeIp={(sourceIp) => onChange({ sourceIp })}
        onChangePort={(sourcePort) => onChange({ sourcePort })}
      />
      {useMajorApplications ? (
        <div
          className="chosen-container-single trafficShaperVPN-row"
          style={{ width: "70%" }}
        >
          <label>
            Destination
            <select
              className="protocol chosen-single"
              style={{ width: "100%" }}
              value={majorApplication}
              onChange={(event) =>
                onChange({ majorApplication: event.target.value })
              }
            >
              {majorApplicationsList.map((app) => (
                <option value={app}>{app}</option>
              ))}
            </select>
          </label>
        </div>
      ) : (
        <IpPortInputs
          labelIP={"Destination"}
          labelPort={"Dst port"}
          name={"destination"}
          valueIp={destinationIp}
          valuePort={destinationPort}
          onChangeIp={(destinationIp) => onChange({ destinationIp })}
          onChangePort={(destinationPort) => onChange({ destinationPort })}
        />
      )}
      <UplinkSelectionPolicy
        value={{ uplink, fail_over, performance_category }}
        onChange={onChange}
      />

      <div className="iwan_l7 trafficShaperVPN-row">
        <button
          type="button"
          onClick={() => {
            props.submit();
            props.closeDropdown();
          }}
        >
          {/* Special handling of editing a major application: major applications can't be edited, they
            can only be toggled on and off, so if the dropdown is opened via clicking on a major application
            but the user changes to the custom expressions tab the button shouldn't say "Update expression"
            because it would simply be adding a new expression if clicked*/}
          {props.editingTokenIndex === null
            ? "Add expression"
            : "Update expression"}
        </button>
      </div>
    </div>
  );
};

// TODO how to use hide-when-dns?  Does the ip hide when the ip is CIDR?
// TODO info tooltips
const IpPortInputs = ({
  labelIP,
  labelPort,
  name,
  valueIp,
  valuePort,
  onChangeIp,
  onChangePort
}) => {
  const portName = `${name}-port`;
  return (
    <div className="iwan_l7 trafficShaperVPN-row">
      <div style={{ display: "flex" }}>
        <div>
          <label>
            {labelIP}
            <i
              alt="[Help]"
              className="asx_p fa fa-info-circle auto_hohelp idh_4557691403"
            ></i>
            <br />
            <div
              className="chosen-container chosen-container-single chosen-container-single-nosearch chosen-container-active"
              style={{ marginRight: "8px" }}
            >
              <input
                className="chosen-single"
                name={name}
                placeholder="Any"
                value={valueIp}
                onChange={(evt) => {
                  onChangeIp(evt.target.value);
                }}
              />
            </div>
          </label>
        </div>
        <div>
          <label>
            {labelPort}
            <i
              alt="[Help]"
              className="asx_p fa fa-info-circle auto_hohelp idh_7008731216"
            ></i>
            <br />
            <div className="chosen-container chosen-container-single chosen-container-single-nosearch chosen-container-active">
              <input
                className="chosen-single"
                name={portName}
                placeholder="Any"
                size="4"
                value={valuePort}
                onChange={(evt) => {
                  onChangePort(evt.target.value);
                }}
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
