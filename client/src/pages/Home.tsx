import React, { Component, ReactElement, Fragment } from "react";

/**
 * Interfaces
 */
interface HomeProps {
    isLogin: boolean,
    statusMessage: string
}

export default class Home extends Component<HomeProps> {
    constructor(props: HomeProps) {
        super(props);

        this.state = {}
    }

    render(): ReactElement {
        return <Fragment>
            <div className="form-container">
                <div className="form">
                    {
                        this.props.isLogin?
                            <Fragment>
                                <h1 className="line">{this.props.statusMessage}</h1>
                                <h3 className="line">You have entered the correct verification code</h3>
                            </Fragment>:
                            <Fragment>
                                <h1 className="line">You are not verified yet</h1>
                            </Fragment>
                    }
                </div>
            </div>
        </Fragment>;
    }
}