import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Strings } from '../../lang/strings';
import Globals from '../../Globals';

export default class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <footer className={css(styles.footerContainer)}>
                {"Footer"}
            </footer>
        );
    }
}

const styles = StyleSheet.create({
    footerContainer: {
        padding: 10,
        borderTop: `1px solid ${Globals.colors.frameBorders}`
    }
});