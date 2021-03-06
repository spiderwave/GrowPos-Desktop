import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux'
import { Tab } from 'semantic-ui-react'
import { withStyles } from '@material-ui/core/styles';
import DataProvider from '../../LocalDB'

import Setup from './Setup'

const style = (theme) => ({
    CartBody: {
        borderRadius: 0,
        border: 0,
        padding: '0 0px',
        boxShadow: '0 0px 0px 0px ',
        background: 'white',
        overflow: 'auto',
    },
    CartAction: {
        borderRadius: 0,
        border: 0,
        height: '60px',
        padding: '0 0px',
        boxShadow: '0 0px 0px 0px ',
        background: 'white',
        // overflow: 'auto',
        borderTop: '1px solid #f0f0f0'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '40%',
        flexShrink: 0,
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0'
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0'
    },
    maincontainer: {
        background: theme.palette.light
    }

});



class Reports extends Component {
    constructor(props) {
        super(props)
        this.updateDimensions = this.updateDimensions.bind(this);
        this.state = {
            width: 0,
            height: 0,
            activeIndex: 0,
            current: null
        };
    }
 
    render() {
        const { height } = this.state
        const { classes } = this.props;

        const panes = [

            {
                menuItem: 'Sells Records',
                render: () => (
                    <Tab.Pane attached={false} active={true} style={{ padding: '0px' }}>
                        <Grid container className={classes.maincontainer} >
                            <Grid item xs={12} sm={12}>
                                <DataProvider>
                                    <Setup height={height} />
                                </DataProvider>
                            </Grid>
                        </Grid>
                    </Tab.Pane>
                )
            }
        ]

        return (
            <Grid container spacing={1} style={{ padding: '5px' }}>
                <Grid item xs={12} sm={12} >
                    <Tab
                        menu={{ borderless: true, attached: false, tabular: false, }}
                        panes={panes}
                    />
                </Grid>
            </Grid>
        );
    }

    updateDimensions = () => {
        this.setState({ width: document.getElementById('Content').clientWidth, height: document.getElementById('Content').clientHeight });
    };
    componentDidMount() {
        if (this.state.width !== document.getElementById('Content').clientWidth) {
            this.updateDimensions()
        }
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

}
const mapStateToProps = (state) => {
    return {

    }
}

export default connect(mapStateToProps)(withStyles(style, { withTheme: true })(Reports))


