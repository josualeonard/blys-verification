import React, { Component, ReactElement, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';

/**
 * Interfaces
 */
interface LoginProps {
    setAppState: (isLogin: boolean, statusMessage: string) => void
}
interface State {
    digits: string[],
    errors: boolean[],
    isEmpty: boolean,
    status: number,
    statusMessage: string,
    isVerifying: false,
    isVerified: false
}

export default class Login extends Component<LoginProps> {
    static digits = 6;

    constructor(props: LoginProps) {
        super(props);

        this.state = {
            digits: [],
            errors: [],
            isEmpty: false,
            status: 0,
            statusMessage: "",
            isVerifying: false,
            isVerified: false
        }

        this.setAppState = this.setAppState.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handlePaste = this.handlePaste.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public readonly state: State = {
        digits: [],
        errors: [],
        isEmpty: false,
        status: 0,
        statusMessage: "",
        isVerifying: false,
        isVerified: false
    }

    setAppState(isLogin: boolean, statusMessage: string): void {
        this.props.setAppState(isLogin, statusMessage);
    }

    // Prev/back field
    handleKeyDown(event: any) {
        const keyCode = event.keyCode;
        const elm = event.target;
        const fieldId = parseInt(elm.getAttribute('data-field-id'));
        // Prev/back field
        switch(keyCode) {
            // Backspace
            case 8: this.onFieldUpdate(elm, -1, fieldId, -1); break;
            // Left
            // eslint-disable-next-line no-fallthrough
            case 37:
            // eslint-disable-next-line no-fallthrough
            case 38: this.gotoPrevField(fieldId); break;
            case 39: 
            // eslint-disable-next-line no-fallthrough
            case 40: this.gotoNextField(fieldId); break;
            
        }
    }

    handleKeyPress(event: any) {
        const num = parseInt(event.key);
        const elm = event.target;
        const fieldId = parseInt(elm.getAttribute('data-field-id'));
        this.onFieldUpdate(elm, num, fieldId);
    }

    handlePaste(event: any) {
        const pasted = event.clipboardData.getData("Text").replace(/[^0-9]/g, '');
        const elm = event.target;
        const fieldId = parseInt(elm.getAttribute('data-field-id'));
        let digits = this.state.digits;
        let errors = this.state.errors;
        elm.blur();
        if(pasted.length>0) {
            let idx = 0;
            for(let i=1;i<=Login.digits;i++) {
                let inp = document.getElementById("input"+i) as HTMLInputElement;
                if(i<fieldId) {
                    if(!digits[i-1]) {
                        digits[i-1] = "";
                        errors[i-1] = true;
                    }
                }
                if(i>=fieldId) {
                    const num = pasted[idx];
                    idx++;
                    if(!isNaN(num)) {
                        digits[i-1] = num;
                        errors[i-1] = false;
                        if(inp) inp.value = num;
                    } else {
                        if(!digits[i-1]) {
                            digits[i-1] = "";
                            errors[i-1] = true;
                        }
                    }
                }
            }
        }
    }

    onFieldUpdate(elm: any, num: number, fieldId: number, go: number = 1): void {
        let digits = this.state.digits;
        let errors = this.state.errors;
        let isEmpty= this.state.isEmpty;
        if(!isNaN(fieldId)) {
            if(digits.length<fieldId) {
                for(let i=1;i<=fieldId;i++) {
                    if(!digits[i-1]) {
                        digits[i-1] = "";
                    }
                    if(!errors[i-1]) {
                        errors[i-1] = false;
                    }
                }
            }
            isEmpty = false;

            if(!isNaN(num)) {
                digits[(fieldId-1)] = (num>=0)?num.toString():"";
                errors[(fieldId-1)] = false;
                this.setState({status: 0, digits: digits, errors: errors, isEmpty: isEmpty}, () => {
                    elm.blur();
                    elm.value = (num>=0)?num:"";
                    setTimeout(() => {
                        if(go>0) this.gotoNextField(fieldId, fieldId===Login.digits);
                        else this.gotoPrevField(fieldId);
                    }, 50);
                });
            } else {
                errors[(fieldId-1)] = true;
                elm.blur();
                elm.value = "";
                setTimeout(() => {
                    elm.focus();
                    this.setState({status: -1, digits: digits, errors: errors, isEmpty: isEmpty});
                }, 100);
            }
            
        }
    }

    gotoNextField(fieldId: number, blurNext: boolean = false): void {
        const prevElm = (document.getElementById("input"+((fieldId+1<=Login.digits)?fieldId+1:fieldId)) as HTMLInputElement);
        if(prevElm) {
            prevElm.blur();
            if(!blurNext) {
                setTimeout(() => {
                    prevElm.focus();
                }, 50); 
            }
        }
    }

    gotoPrevField(fieldId: number): void {
        const prevElm = (document.getElementById("input"+((fieldId-1>=1)?fieldId-1:fieldId)) as HTMLInputElement);
        if(prevElm) {
            prevElm.blur();
            setTimeout(() => {
                prevElm.focus();
            }, 50);
        }
    }

    handleFocus(event: any) {
        if(this.state.isVerifying) {
            event.target.blur();
        } else {
            this.setState({status: 0});
            event.target.select();
        }
    }

    handleSubmit(event: any) {
        event.preventDefault();
        const digits = this.state.digits;
        let errors = this.state.errors;
        let filled:boolean = true;
        let empty = 0;
        if(digits.length<Login.digits) {
            filled = false;
            for(let i=1;i<=Login.digits;i++) {
                if(!digits[i-1] || digits[i-1].length<=0) {
                    errors[i-1] = true;
                    empty++;
                }
            }
        } else {
            for(let i=1;i<=digits.length;i++) {
                if(digits[i-1].length<=0) {
                    filled = false;
                    errors[i-1] = true;
                }
            }
        }
        
        if(filled) {
            this.setState({status: 0, isVerifying: true}, () => {
                this.verify().then((response) => {
                    const body = response.body || {};
                    const success = (body.status || "")==="success";
                    const message = body.message || "";
                    this.setState({isVerifying: false, status: success?1:-3, statusMessage: message}, () => {
                        if(success) {
                            setTimeout(() => {
                                this.setAppState(success, message);
                                this.setState({isVerified: true});
                            }, 2000);
                        }
                    });
                });
            });
        } else {
            this.setState({status: -2, errors: errors, isEmpty: empty===Login.digits});
        }

        return false;
    }

    async verify() {
        const code = this.state.digits.join("");
        const response = await fetch(`/api/v1.0/verify`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({code: code})
        });
        return await response.json();
    }

    componentDidMount(): void {
        const firstInput = document.getElementById("input1");
        if(firstInput) firstInput.focus();
    }

    message():string {
        switch(this.state.status) {
            case -1: return "Invalid input, only use number";
            case -2: return (this.state.isEmpty)?"Verification code cannot be empty":"Incomplete verification code";
            case -3: return this.state.statusMessage;
            case 1: return this.state.statusMessage;
        }
        return "";
    }

    render(): ReactElement {
        if(this.state.isVerified) return <Redirect to={{pathname: "/success"}} />;

        return <Fragment>
            <div className={"form-container"+(this.state.isVerifying?" verifying":"")}>
                <form id="verification" className="form" onSubmit={this.handleSubmit}>
                    <CSSTransition
                        in={this.state.status!==0}
                        timeout={300}
                        classNames="alert"
                        unmountOnExit
                    >
                        <div className="alert"><h3 className={this.state.status>0?"success":"error"}>{this.message()}</h3></div>
                    </CSSTransition>
                    <h1 className="line">Verification code:</h1>
                    <div className="line">
                        {
                            Array.from(Array(6), (e, i) => {
                                return <input key={(i+1)} id={"input"+(i+1)} data-field-id={(i+1)} type="text" className={this.state.errors.length>=i?(this.state.errors[i]?"error":""):""} defaultValue={this.state.digits.length>=i?this.state.digits[i]:""} autoComplete="off" autoCorrect="off" spellCheck={false} onKeyPress={this.handleKeyPress} onPaste={this.handlePaste} onKeyDown={this.handleKeyDown} onFocus={this.handleFocus}></input>;
                            })
                        }
                    </div>
                    <div className="line">
                        {
                            this.state.isVerifying?
                                <div className="submit"><div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>:
                                <button type="submit">Submit</button>
                        }
                    </div>
                </form>
            </div>
        </Fragment>;
    }
}