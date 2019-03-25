'use strict';

const morphin = require('../index');
const joi = require('joi');

describe('Morphin library', () => {

    it('Should have `go` method', () => {
        joi.assert(morphin, joi.object().required().keys({
            go: joi.func().required()
        }));
    });

    describe('Mapper', () => {

        describe('Single property', () => {
            
            it('<Boolean> - "target.path": true', () => {
                let source = {
                    user: {
                        address: 'tommy@power.rangers'
                    }
                };
                let target = morphin.go({
                    source,
                    mapper: {
                        'user.address': true
                    }
                });
                joi.assert(target, joi.object().required().keys({
                    user: joi.object().required().keys({
                        address: joi.string().required().valid(source.user.address)
                    })
                }));
            });
    
            it('<Number>(1) - "target.path": 1', () => {
                let source = {
                    user: {
                        address: 'tommy@power.rangers'
                    }
                };
                let target = morphin.go({
                    source,
                    mapper: {
                        'user.address': 1
                    }
                });
                joi.assert(target, joi.object().required().keys({
                    user: joi.object().required().keys({
                        address: joi.string().required().valid(source.user.address)
                    })
                }));
            });
    
            it('<String> - "target.path": "source.path"', () => {
                let source = {
                    user: {
                        address: 'tommy@power.rangers'
                    }
                };
                let target = morphin.go({
                    source,
                    mapper: {
                        'Email.From.Address': 'user.address'
                    }
                });
                joi.assert(target, joi.object().required().keys({
                    Email: joi.object().required().keys({
                        From: joi.object().required().keys({
                            Address: joi.string().required().valid(source.user.address)
                        })
                    })
                }));
            });
    
            it('<Function> - "target.path": () => ...', () => {
                let VALUE = 123;
                let target = morphin.go({
                    mapper: {
                        'Email.From.Address': () => VALUE
                    }
                });
                joi.assert(target, joi.object().required().keys({
                    Email: joi.object().required().keys({
                        From: joi.object().required().keys({
                            Address: joi.number().required().valid(VALUE)
                        })
                    })
                }));
            });

        });

        describe('Multi properties', () => {
        
            it('<Array>[<String>, <Function>, <Boolean>(true)] - "target.path": ["source.path", () => ...]', () => {
                let source = {
                    user: {
                        age: 24
                    }
                };
                let target = morphin.go({
                    source,
                    mapper: {
                        'isUnderage': ['user.age', age => age < 21],
                        'isPowerRangersFan': ['user.unlikes.PowerRangers', unlike => unlike === undefined]
                    }
                });
                joi.assert(target, joi.object().required().keys({
                    isUnderage: joi.boolean().required().valid(false),
                    isPowerRangersFan: joi.boolean().required().valid(true),
                }));
            });

            it('<Array>[<String>, <Function>, <Boolean>(false)] - "target.path": ["source.path", () => ..., false]', () => {
                let someFunction = () => new Date();
                let source = {
                    user: {
                        age: 30
                    }
                };
                let target = morphin.go({
                    source,
                    mapper: {
                        'userAge': ['user.age', someFunction, false],
                        'userCreatedAt': ['user.createdAt', someFunction, false],
                    }
                });
                joi.assert(target, joi.object().required().keys({
                    userAge: joi.number().required().valid(source.user.age),
                    userCreatedAt: joi.func().required()
                }));
            });

            it('<Array>[<String>, <Any>] - "target.path": ["source.path", ...]', () => {
                let source = {
                    user: {
                        name: 'Tommy'
                    }
                };
                let target = morphin.go({
                    source,
                    mapper: {
                        'name': ['user.name', 'Unknwon'],
                        'country': ['user.country', 'Brazil'],
                        'age': ['user.age', null]
                    }
                });
                joi.assert(target, joi.object().required().keys({
                    name: joi.string().valid('Tommy').required(),
                    country: joi.string().valid('Brazil').required(),
                    age: joi.object().valid(null).required()
                }));
            });

            it('<Array>[<Object>(null), <Any>] - "target.path": [null, ...]', () => {
                let source = {
                    user: {
                        name: 'Tommy'
                    }
                };
                let target = morphin.go({
                    source,
                    mapper: {
                        'name': [null, 'Unknwon'],
                        'age': [null, null]
                    }
                });
                joi.assert(target, joi.object().required().keys({
                    name: joi.string().valid('Unknwon').required(),
                    age: joi.object().valid(null).required()
                }));
            });

        });

    });

});
