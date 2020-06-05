import React, { Component } from 'react';
import CityList from './CityList';

class Input extends Component 
{
    constructor(props) 
    {
        super(props);

        this.state = 
        {
            inputZipCode: "",
            alreadyAddedStates: [],
            ifLoading: false
        };

        this.input = React.createRef();
    }

    getSelected = (zipcode) => {

        let newAlredyAddedState = this.state.alreadyAddedStates.map(item => {
            if (+item.zipcode === +zipcode) {
                return {
                    ...item,
                    selected: !item.selected
                }
            } else {
                return {
                    ...item,
                    selected: false
                }
            }
        })

        let ifSelectedExist = newAlredyAddedState.some(item => {
            return item.selected === true;
        })

        let zipcodeToState;

        if (!ifSelectedExist) {
            zipcodeToState = "";
        } else {
            zipcodeToState = zipcode;
        }

        this.setState({ alreadyAddedStates: newAlredyAddedState, inputZipCode: zipcodeToState });
    }

    inputZipCode = (event) => {
        let inputZipCode = event.target.value.replace(/\D/g, '');
        this.setState({ inputZipCode })
    }

    addStateByZipCode = () => {
        if (this.state.inputZipCode === "") {
            alert("The input field can not be empty!");
            return;
        }

        if (this.state.inputZipCode.length < 5 || this.state.inputZipCode.length > 5) {
            alert("The zipcode must contain 5 digits!");
            return;
        }

        const checkExistingZipCodes = this.state.alreadyAddedStates.find(zipcode => +zipcode.zipcode === +this.state.inputZipCode);

        if (checkExistingZipCodes) {
            this.input.current.select();
            alert("State with this zipcode has already been added");
            return;
        }

        this.setState({ ifLoading: true });

        const APIKEY = "OM7P5RG84VGHRJHE9X6Z";

        fetch(`${this.state.inputZipCode}?key=${APIKEY}`)
            .then((zipcode) => {
                return zipcode.json();
            })
            .then(zipcode => {

                if (!zipcode.ZipCode) {
                    alert("Current zip code does not exist");
                    return;
                }

                let selectedPosition = this.state.alreadyAddedStates.some(item => {
                    return item.selected === true;
                });

                if (selectedPosition) {

                    let updateSelectedCity = this.state.alreadyAddedStates.map(item => {
                        if (item.selected === true) {
                            return {
                                zipcode: zipcode.ZipCode,
                                city: zipcode.City,
                                state: zipcode.State,
                                selected: true
                            }
                        }
                        return {
                            zipcode: item.zipcode,
                            city: item.city,
                            state: item.state,
                            selected: false
                        }
                    })

                    this.setState({
                        alreadyAddedStates: updateSelectedCity,
                        inputZipCode: ""
                    })
                } else {
                    this.setState({
                        alreadyAddedStates: [...this.state.alreadyAddedStates, {
                            zipcode: zipcode.ZipCode,
                            city: zipcode.City,
                            state: zipcode.State,
                            selected: false
                        }],
                        inputZipCode: ""
                    })
                }
                this.setState({ ifLoading: false });
            })
            .catch(err => {
                alert("Search error, try again or try again later");
                this.setState({ ifLoading: false });
            })
        }
    }

