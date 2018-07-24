import React, {PureComponent} from 'react';
import Banner from 'Wadi/src/components/widgets/banner';
import SuperSmashigProduct from 'Wadi/src/components/widgets/superSmashing';
import * as GLOBAL from 'Wadi/src/utilities/constants';
import GroceryProductPLP from '../plp/groceryProductPLP';
import GridProductPLP from '../../views/gridProductPLP';
import HorizontalProductPLP from '../../views/horizontalProductPLP';
import SingleProduct from '../../views/singleProductPLP'


let isGrocery = GLOBAL.CONFIG.isGrocery;
const bannerWidget="banner_widget"
const SUPER_SMASHING_PRODUCT="super_smashing_product"

export default class ListItem extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        let { rowData, selectedLayout, widgetClicked } = this.props
        if(rowData.type){
            if (rowData.type == bannerWidget) {
                return <Banner bannerData={rowData} callBack={() => widgetClicked(rowData)} />
            }
            if (rowData.type == SUPER_SMASHING_PRODUCT) {
                return <SuperSmashigProduct widgetData={rowData} callBack={() => widgetClicked(rowData)} />
            }

        }

        if (isGrocery) {
            return (
                <GroceryProductPLP data={rowData} callBack={() => widgetClicked(rowData)}/>
            )
        }
        if (selectedLayout == 1) {
            return (
                <GridProductPLP data={rowData} callBack={() => widgetClicked(rowData)} />
            )
        }
        if (selectedLayout == 2) {
            return (
                <HorizontalProductPLP data={rowData} callBack={() => widgetClicked(rowData)} />
            )
        }
        return <SingleProduct data={rowData} callBack={() => widgetClicked(rowData)} />
    }
}
