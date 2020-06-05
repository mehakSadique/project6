import React, { Component } from 'react';

class CityList extends Component {

    makeStateList = () => {
        let stateList = this.props.zipcodes.map(item => {
            return (
                <div className="city-box" key={item.zipcode} >
                    <div className={item.selected ? "city-selected" : "city"} onClick={() => { this.props.getSelected(item.zipcode) }}>
                        <span>{`${item.city}, ${item.state}`}</span>
                    </div>
                </div>
            )
        })

        return stateList;
    }

    render() {
        return (
            <div>
                {this.makeStateList()}
            </div>
        );
    }
}

export default CityList;