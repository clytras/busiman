import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Strings } from '@i18n';
import Globals from '@app/globals';

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
