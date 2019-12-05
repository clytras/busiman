import React from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import { Strings } from '../../lang/strings';
import Globals from '../../Globals';
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';

import 'react-accessible-accordion/dist/fancy-example.css';

export default class SideNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <nav className={css(styles.sidenavContainer) + ' sidenav'}>
                <Accordion accordion={false}>
                    <AccordionItem>
                        <AccordionItemTitle>
                            <h3 className="u-position-relative">
                                Simple title
                                <div className="accordion__arrow" role="presentation" />
                            </h3>
                        </AccordionItemTitle>
                        <AccordionItemBody>
                            <p>Body content</p>
                        </AccordionItemBody>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionItemTitle>
                            <h3 className="u-position-relative">
                                Complex title
                                <div className="accordion__arrow" role="presentation" />
                            </h3>
                        </AccordionItemTitle>
                        <AccordionItemBody>
                            <p>Body content</p>
                        </AccordionItemBody>
                    </AccordionItem>
                </Accordion>
            </nav>
        );
    }
}

const styles = StyleSheet.create({
    sidenavContainer: {
        height: '100%',
        backgroundColor: Globals.colors.sideNavBg,
        borderRight: `1px solid ${Globals.colors.sideNavBorder}`
    }
});