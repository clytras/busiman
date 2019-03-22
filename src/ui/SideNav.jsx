import React from 'react';
import { StyleSheet, css } from 'aphrodite/no-important';
import { Strings } from '../i18n/strings';
import Globals from '../Globals';
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';

//import 'react-accessible-accordion/dist/fancy-example.css';

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
                                Orders
                                <div className="accordion__arrow" role="presentation" />
                            </h3>
                        </AccordionItemTitle>
                        <AccordionItemBody>
                            <ul className="inlineMenuList">
                              <li><a href="#">Live Orders</a></li>
                              <li><a href="#">In Progress</a></li>
                              <li><a href="#">Delivered</a></li>
                              <li><a href="#">New Order</a></li>
                            </ul>
                        </AccordionItemBody>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionItemTitle>
                            <h3 className="u-position-relative">
                                Market Places
                                <div className="accordion__arrow" role="presentation" />
                            </h3>
                        </AccordionItemTitle>
                        <AccordionItemBody>
                            <ul className="inlineMenuList">
                              <li>Add a New</li>
                              <li>Visited</li>
                              <li>Partners</li>
                            </ul>
                        </AccordionItemBody>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionItemTitle>
                            <h3 className="u-position-relative">
                                Riders
                                <div className="accordion__arrow" role="presentation" />
                            </h3>
                        </AccordionItemTitle>
                        <AccordionItemBody>
                            <ul className="inlineMenuList">
                              <li>Active Now</li>
                              <li>All</li>
                              <li>Archived</li>
                            </ul>
                        </AccordionItemBody>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionItemTitle>
                            <h3 className="u-position-relative">
                                Products
                                <div className="accordion__arrow" role="presentation" />
                            </h3>
                        </AccordionItemTitle>
                        <AccordionItemBody>
                            <ul className="inlineMenuList">
                              <li>Archive</li>
                            </ul>
                        </AccordionItemBody>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionItemTitle>
                            <h3 className="u-position-relative">
                                Settings
                                <div className="accordion__arrow" role="presentation" />
                            </h3>
                        </AccordionItemTitle>
                        <AccordionItemBody>
                            <ul className="inlineMenuList">
                              <li>Preferences</li>
                            </ul>
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
    },
    inlineMenuList: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
});
