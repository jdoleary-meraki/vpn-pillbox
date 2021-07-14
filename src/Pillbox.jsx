import React from "react";

export default function WithPillbox(WrappedComponent) {
  return class Pillbox extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        tokens: [],
        activeTab: 0,
        isDropdownOpen: false,
        editingTokenId: null
      };
      this.addToken = this.addToken.bind(this);
      this.updateToken = this.updateToken.bind(this);
      this.removeToken = this.removeToken.bind(this);
      this.closeDropdown = this.closeDropdown.bind(this);
    }
    pickTab(activeTab) {
      this.setState({ activeTab });
    }
    removeToken(index) {
      console.log("removeToken", index, this.state.tokens);
      this.setState((prevState) => {
        return {
          tokens: prevState.tokens.filter((token, i) => i !== index)
        };
      });
    }
    updateToken(token, index) {
      const { tokens } = this.state;
      if (tokens[index]) {
        this.setState((prevState) => {
          return {
            tokens: [
              ...prevState.tokens.slice(0, index),
              token,
              ...prevState.tokens.slice(index + 1)
            ]
          };
        });
      } else {
        console.error("Could not update token at index", index);
      }
    }
    addToken(token) {
      this.setState((prevState) => {
        return {
          tokens: [...prevState.tokens, token]
        };
      });
    }
    openDropdown(editingTokenId = null) {
      this.setState({
        isDropdownOpen: true,
        editingTokenId
      });
    }
    closeDropdown() {
      this.setState({
        isDropdownOpen: false,
        // Clear the state that determines which token is being edited
        editingTokenId: null
      });
    }
    render() {
      return (
        <div>
          <div className="tclass">
            <div className="traffic_shaper">
              <div className="pillbox vpn_exclusion">
                {this.state.tokens.map((token, index) => (
                  <Token
                    key={token.name}
                    name={token.name}
                    onClick={() => this.openDropdown(index)}
                    onRemove={() =>
                      this.setState((previousState) => {
                        return {
                          tokens: previousState.tokens.filter(
                            (t) => t !== token
                          )
                        };
                      })
                    }
                  />
                ))}
                <div className="actions btn-group">
                  <button
                    className="btn btn-default"
                    onClick={() => this.openDropdown()}
                  >
                    Add&nbsp;
                    <i className="fa fa-plus plus"></i>
                  </button>
                </div>
              </div>

              <div
                id="rule_menu_vpn_exclusion_shaper"
                className="btn-group dropdown open"
                data-domplate="id"
                style={{ display: "block" }}
              >
                <a
                  className="btn btn-default dropdown-toggle"
                  style={{ display: "none" }}
                  data-toggle="dropdown"
                  data-domplate="href"
                  href="#rule_menu_vpn_exclusion_shaper"
                >
                  Dropdown
                  <b className="caret"></b>
                </a>

                {this.state.isDropdownOpen && (
                  <WrappedComponent
                    tokens={this.state.tokens}
                    addToken={this.addToken}
                    updateToken={this.updateToken}
                    removeToken={this.removeToken}
                    editingTokenId={this.state.editingTokenId}
                    closeDropdown={this.closeDropdown}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };
}
const Token = ({ name, onClick, onRemove }) => {
  return (
    <div className="token" style={{ cursor: "pointer" }} onClick={onClick}>
      <span className="content">
        <span className="small_print">Layer 3&nbsp;</span>
        <span className="value">{name}</span>
        <input
          type="hidden"
          className="value layer3"
          data-domplate="name"
          data-domplate-name="wired_config[vpn_exclusion_signatures][{{model.current_sig}}][val]"
          value=" Any to 1.1.1.0/24:2020"
          name="wired_config[vpn_exclusion_signatures][5][val]"
        />
        <input
          type="hidden"
          className="signature_type"
          value="custom_layer3"
          data-domplate="name"
          data-domplate-name="wired_config[vpn_exclusion_signatures][{{model.current_sig}}][signature_type]"
          name="wired_config[vpn_exclusion_signatures][5][signature_type]"
        />
      </span>
      <span className="tail" onClick={() => onRemove()}>
        <i className="fa fa-remove"></i>
      </span>
    </div>
  );
};
