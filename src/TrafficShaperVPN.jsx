import React from "react";
import classnames from "classnames";
const CUSTOM_EXPRESSIONS = "CUSTOM_EXPRESSIONS";
const MAJOR_APPLICATIONS = "MAJOR_APPLICATIONS";
const defaultTab = CUSTOM_EXPRESSIONS;
const defaultEditingData = {
  protocol: "any",
  sourceIp: "",
  sourcePort: "",
  destinationIp: "",
  destinationPort: ""
};
// TODO better name for class
export default class TrafficShaperVPN extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: defaultTab,
      editingData: defaultEditingData
    };
  }
  componentDidMount() {
    this.initEditingToken();
  }
  componentDidUpdate(prevProps) {
    // When the token that is being edited changes, run init code
    if (this.props.editingTokenId !== prevProps.editingTokenId) {
      this.initEditingToken();
    }
  }
  initEditingToken() {
    const token = this.props.tokens[this.props.editingTokenId];
    console.log("token", token, defaultEditingData);
    this.setState({
      editingData: token || defaultEditingData,
      activeTab: !token
        ? defaultTab
        : token.isMajorApplication
        ? MAJOR_APPLICATIONS
        : CUSTOM_EXPRESSIONS
    });
  }
  pickTab(activeTab) {
    this.setState({ activeTab });
  }
  render() {
    return (
      <div className="pillbox-dropdown dropdown-widget iwan_l7">
        <ul className="overview cats iwan_l7">
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
        {this.state.activeTab === MAJOR_APPLICATIONS && (
          <MajorApplications
            editingTokenId={this.props.editingTokenId}
            addOrUpdate={this.props.addOrUpdate}
            removeToken={this.props.removeToken}
            tokens={this.props.tokens}
          />
        )}
        {this.state.activeTab === CUSTOM_EXPRESSIONS && (
          <CustomExpressions
            editingTokenId={this.props.editingTokenId}
            tokens={this.props.tokens}
            closeDropdown={this.props.closeDropdown}
            value={this.state.editingData}
            onChange={({
              protocol,
              sourceIp,
              sourcePort,
              destinationIp,
              destinationPort
            }) => {
              console.log(
                "onchange",
                protocol,
                sourceIp,
                sourcePort,
                destinationIp,
                destinationPort
              );
              this.setState(
                (prevState) => {
                  const editingData = {
                    protocol: protocol || prevState.editingData.protocol,
                    sourceIp: sourceIp || prevState.editingData.sourceIp,
                    sourcePort: sourcePort || prevState.editingData.sourcePort,
                    destinationIp:
                      destinationIp || prevState.editingData.destinationIp,
                    destinationPort:
                      destinationPort || prevState.editingData.destinationPort
                  };
                  editingData.name = makeNameFromEditingData(editingData);
                  return {
                    editingData
                  };
                },
                () => {
                  console.log("state", this.state.editingData);
                }
              );
            }}
            submit={() => this.props.addOrUpdate(this.state.editingData)}
          />
        )}
      </div>
    );
  }
}
function makeNameFromEditingData({
  protocol,
  sourceIp,
  sourcePort,
  destinationIp,
  destinationPort
}) {
  return `${protocol}:${sourceIp}:${sourcePort} to ${destinationIp}:${destinationPort}`;
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
const MajorApplications = (props) => {
  const { addOrUpdate, tokens, removeToken } = props;
  return (
    <ul
      className="category group-0 iwan_l7"
      style={{ display: "block", height: "315px" }}
    >
      {majorApplicationsList.map((name) => {
        const isActive = tokens
          .filter((t) => t.isMajorApplication)
          .find((t) => t.name === name);
        return (
          <li
            key={name}
            style={{
              backgroundColor: isActive ? "#e6e6e6" : undefined,
              margin: 0,
              textAlign: "left",
              width: "100%",
              display: "block",
              cursor: "pointer"
            }}
            onClick={() => {
              if (isActive) {
                removeToken(tokens.findIndex((t) => t.name === name));
              } else {
                addOrUpdate({ name, isMajorApplication: true });
              }
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <div
                style={{
                  padding: "1ex 0 1ex 2ex"
                }}
              >
                {name}
              </div>
              <div
                style={{
                  float: "right",
                  padding: "1ex 2ex 1ex 2ex"
                }}
              >
                <i className="active fa fa-remove"></i>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const CustomExpressions = (props) => {
  const { onChange } = props;
  const {
    protocol,
    sourceIp,
    sourcePort,
    destinationIp,
    destinationPort
  } = props.value;
  return (
    <div
      className="category sub custom_pane iwan_l7"
      style={{ height: "315px", display: "block" }}
    >
      <h3>
        <span
          id="nettish_label_vpn_exclusion_shaper_header"
          data-domplate="id"
          data-domplate-id="nettish_label_{{model.identifier}}_header"
        >
          Custom expressions
        </span>
      </h3>

      <div className="custom expressions">
        <div className="custom custom-net expression iwan_l7">
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
          <IpPortInputs
            labelIP={"Destination"}
            labelPort={"Dst port"}
            name={"destination"}
            valueIp={destinationIp}
            valuePort={destinationPort}
            onChangeIp={(destinationIp) => onChange({ destinationIp })}
            onChangePort={(destinationPort) => onChange({ destinationPort })}
          />

          <div className="iwan_l7 descriptor">
            <button
              type="button"
              onClick={() => {
                props.submit();
                props.closeDropdown();
              }}
            >
              {props.editingTokenId === null
                ? "Add expression"
                : "Update expression"}
            </button>
          </div>
        </div>
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
    <div className="iwan_l7 descriptor">
      <div style={{ display: "flex" }}>
        <div style={{ width: "80%" }}>
          <label>
            {labelIP}
            <i
              alt="[Help]"
              className="asx_p fa fa-info-circle auto_hohelp idh_4557691403"
            ></i>

            <div
              className="chosen-container chosen-container-single chosen-container-single-nosearch chosen-container-active"
              title=""
              id=""
              style={{ width: "100%" }}
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
            <input
              name={portName}
              placeholder="Any"
              size="4"
              value={valuePort}
              onChange={(evt) => {
                onChangePort(evt.target.value);
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};
