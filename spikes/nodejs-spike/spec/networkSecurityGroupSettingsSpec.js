describe('networkSecurityGroupSettings', () => {
    let rewire = require('rewire');
    let _ = require('lodash');
    let nsgSettings = rewire('../core/networkSecurityGroupSettings.js');
    let validation = require('../core/validation.js');

    describe('isValidProtocol', () => {
        let isValidProtocol = nsgSettings.__get__('isValidProtocol');
        
        it('undefined', () => {
            expect(isValidProtocol()).toEqual(false);
        });

        it('null', () => {
            expect(isValidProtocol(null)).toEqual(false);
        });

        it('empty', () => {
            expect(isValidProtocol('')).toEqual(false);
        });

        it('whitespace', () => {
            expect(isValidProtocol(' ')).toEqual(false);
        });

        it('invalid spacing', () => {
            expect(isValidProtocol(' TCP ')).toEqual(false);
        });

        it('invalid casing', () => {
            expect(isValidProtocol('tcp')).toEqual(false);
        });

        it('invalid value', () => {
            expect(isValidProtocol('NOT_A_VALID_PROTOCOL')).toEqual(false);
        });

        it('TCP', () => {
            expect(isValidProtocol('TCP')).toEqual(true);
        });

        it('UDP', () => {
            expect(isValidProtocol('UDP')).toEqual(true);
        });

        it('*', () => {
            expect(isValidProtocol('*')).toEqual(true);
        });
    });

    describe('isValidAddressPrefix', () => {
        let isValidAddressPrefix = nsgSettings.__get__('isValidAddressPrefix');
        
        it('undefined', () => {
            expect(isValidAddressPrefix()).toEqual(false);
        });

        it('null', () => {
            expect(isValidAddressPrefix(null)).toEqual(false);
        });

        it('empty', () => {
            expect(isValidAddressPrefix('')).toEqual(false);
        });

        it('whitespace', () => {
            expect(isValidAddressPrefix(' ')).toEqual(false);
        });

        it('invalid spacing', () => {
            expect(isValidAddressPrefix(' 127.0.0.1 ')).toEqual(false);
        });

        it('invalid casing', () => {
            expect(isValidAddressPrefix('virtualnetwork')).toEqual(false);
        });

        it('invalid value', () => {
            expect(isValidAddressPrefix('NOT_A_VALID_ADDRESS_PREFIX')).toEqual(false);
        });
        
        it('invalid IP Address', () => {
            expect(isValidAddressPrefix('127.0.0')).toEqual(false);
        });

        it('invalid CIDR', () => {
            expect(isValidAddressPrefix('127.0.0.1/33')).toEqual(false);
        });

        it('IP Address', () => {
            expect(isValidAddressPrefix('127.0.0.1')).toEqual(true);
        });

        it('CIDR', () => {
            expect(isValidAddressPrefix('127.0.0.1/29')).toEqual(true);
        });

        it('VirtualNetwork', () => {
            expect(isValidAddressPrefix('VirtualNetwork')).toEqual(true);
        });

        it('AzureLoadBalancer', () => {
            expect(isValidAddressPrefix('AzureLoadBalancer')).toEqual(true);
        });

        it('Internet', () => {
            expect(isValidAddressPrefix('Internet')).toEqual(true);
        });

        it('*', () => {
            expect(isValidAddressPrefix('*')).toEqual(true);
        });
    });

    describe('isValidDirection', () => {
        let isValidDirection = nsgSettings.__get__('isValidDirection');
        
        it('undefined', () => {
            expect(isValidDirection()).toEqual(false);
        });

        it('null', () => {
            expect(isValidDirection(null)).toEqual(false);
        });

        it('empty', () => {
            expect(isValidDirection('')).toEqual(false);
        });

        it('whitespace', () => {
            expect(isValidDirection(' ')).toEqual(false);
        });

        it('invalid spacing', () => {
            expect(isValidDirection(' Inbound ')).toEqual(false);
        });

        it('invalid casing', () => {
            expect(isValidDirection('inbound')).toEqual(false);
        });

        it('invalid value', () => {
            expect(isValidDirection('NOT_A_VALID_DIRECTION')).toEqual(false);
        });
        
        it('Inbound', () => {
            expect(isValidDirection('Inbound')).toEqual(true);
        });

        it('Outbound', () => {
            expect(isValidDirection('Outbound')).toEqual(true);
        });
    });

    describe('isValidPriority', () => {
        let isValidPriority = nsgSettings.__get__('isValidPriority');
        
        it('undefined', () => {
            expect(isValidPriority()).toEqual(false);
        });

        it('null', () => {
            expect(isValidPriority(null)).toEqual(false);
        });

        it('empty', () => {
            expect(isValidPriority('')).toEqual(false);
        });

        it('whitespace', () => {
            expect(isValidPriority(' ')).toEqual(false);
        });

        it('too low', () => {
            expect(isValidPriority(99)).toEqual(false);
        });

        it('too high', () => {
            expect(isValidPriority(4097)).toEqual(false);
        });

        it('low', () => {
            expect(isValidPriority(100)).toEqual(true);
        });

        it('high', () => {
            expect(isValidPriority(4096)).toEqual(true);
        });

        it('string', () => {
            expect(isValidPriority('100')).toEqual(true);
        });

        it('string with spacing', () => {
            expect(isValidPriority(' 100 ')).toEqual(true);
        });
    });

    describe('isValidAccess', () => {
        let isValidAccess = nsgSettings.__get__('isValidAccess');
        
        it('undefined', () => {
            expect(isValidAccess()).toEqual(false);
        });

        it('null', () => {
            expect(isValidAccess(null)).toEqual(false);
        });

        it('empty', () => {
            expect(isValidAccess('')).toEqual(false);
        });

        it('whitespace', () => {
            expect(isValidAccess(' ')).toEqual(false);
        });

        it('invalid spacing', () => {
            expect(isValidAccess(' Allow ')).toEqual(false);
        });

        it('invalid casing', () => {
            expect(isValidAccess('allow')).toEqual(false);
        });

        it('invalid value', () => {
            expect(isValidAccess('NOT_A_VALID_ACCESS')).toEqual(false);
        });
        
        it('Allow', () => {
            expect(isValidAccess('Allow')).toEqual(true);
        });

        it('Deny', () => {
            expect(isValidAccess('Deny')).toEqual(true);
        });
    });

    describe('validations', () => {
        let nsgSettingsValidations = nsgSettings.__get__('networkSecurityGroupSettingsValidations');

        describe('networkInterfaceValidations', () => {
            let networkInterfaceValidations = nsgSettingsValidations.networkInterfaces;
            let networkInterfaceSettings = [
                {
                    name: 'my-nic1'
                },
                {
                    name: 'my-nic2'
                }
            ];

            it('empty array', () => {
                let errors = validation.validate({
                    settings: [],
                    validations: networkInterfaceValidations
                });

                expect(errors.length).toEqual(0);
            });

            it('name undefined', () => {
                let settings = _.cloneDeep(networkInterfaceSettings);
                delete settings[0].name;

                let errors = validation.validate({
                    settings: settings,
                    validations: networkInterfaceValidations
                });

                expect(errors.length).toEqual(1);
                expect(errors[0].name).toEqual('[0].name');
            });

            it('name null', () => {
                let settings = _.cloneDeep(networkInterfaceSettings);
                settings[0].name = null;

                let errors = validation.validate({
                    settings: settings,
                    validations: networkInterfaceValidations
                });

                expect(errors.length).toEqual(1);
                expect(errors[0].name).toEqual('[0].name');
            });

            it('name empty', () => {
                let settings = _.cloneDeep(networkInterfaceSettings);
                settings[0].name = '';

                let errors = validation.validate({
                    settings: settings,
                    validations: networkInterfaceValidations
                });

                expect(errors.length).toEqual(1);
                expect(errors[0].name).toEqual('[0].name');
            });
        });

        describe('virtualNetworkValidations', () => {
            let virtualNetworkValidations = nsgSettingsValidations.virtualNetworks;
            let virtualNetworkSettings = [
                {
                    name: 'my-virtual-network',
                    subnets: ['web', 'biz']
                }
            ];

            it('empty array', () => {
                let errors = validation.validate({
                    settings: [],
                    validations: virtualNetworkValidations
                });

                expect(errors.length).toEqual(0);
            });

            it('name undefined', () => {
                let settings = _.cloneDeep(virtualNetworkSettings);
                delete settings[0].name;

                let errors = validation.validate({
                    settings: settings,
                    validations: virtualNetworkValidations
                });

                expect(errors.length).toEqual(1);
                expect(errors[0].name).toEqual('[0].name');
            });

            it('subnets undefined', () => {
                let settings = _.cloneDeep(virtualNetworkSettings);
                delete settings[0].subnets;

                let errors = validation.validate({
                    settings: settings,
                    validations: virtualNetworkValidations
                });

                expect(errors.length).toEqual(1);
                expect(errors[0].name).toEqual('[0].subnets');
            });

            it('subnets empty', () => {
                let settings = _.cloneDeep(virtualNetworkSettings);
                settings[0].subnets = [];

                let errors = validation.validate({
                    settings: settings,
                    validations: virtualNetworkValidations
                });

                expect(errors.length).toEqual(1);
                expect(errors[0].name).toEqual('[0].subnets');
            });

            it('subnets empty string', () => {
                let settings = _.cloneDeep(virtualNetworkSettings);
                settings[0].subnets = [''];

                let errors = validation.validate({
                    settings: settings,
                    validations: virtualNetworkValidations
                });

                expect(errors.length).toEqual(1);
                expect(errors[0].name).toEqual('[0].subnets[0]');
            });
        });

        describe('securityRulesValidations', () => {
            let securityRulesValidations = nsgSettingsValidations.securityRules;

            let valid = [
                {
                    name: 'rule1',
                    direction: 'Inbound',
                    priority: 100,
                    sourceAddressPrefix: '192.168.1.1',
                    destinationAddressPrefix: '*',
                    sourcePortRange: '*',
                    destinationPortRange: '*',
                    access: 'Allow',
                    protocol: '*'
                }
            ];

            it('empty array', () => {
                let errors = validation.validate({
                    settings: [],
                    validations: securityRulesValidations
                });

                expect(errors.length).toEqual(0);
            });

            it('name undefined', () => {
                let invalid = _.cloneDeep(valid);
                delete invalid[0].name;
                let errors = validation.validate({
                    settings: invalid,
                    validations: securityRulesValidations
                });

                expect(errors.length).toEqual(1);
                expect(errors[0].name).toEqual('[0].name');
            });

            it('direction undefined', () => {
                let invalid = _.cloneDeep(valid);
                delete invalid[0].direction;
                let errors = validation.validate({
                    settings: invalid,
                    validations: securityRulesValidations
                });

                expect(errors.length).toEqual(1);
                expect(errors[0].name).toEqual('[0].direction');
            });

            it('priority undefined', () => {
                let invalid = _.cloneDeep(valid);
                delete invalid[0].priority;
                let errors = validation.validate({
                    settings: invalid,
                    validations: securityRulesValidations
                });

                expect(errors.length).toEqual(1);
                expect(errors[0].name).toEqual('[0].priority');
            });

            it('sourceAddressPrefix undefined', () => {
                let invalid = _.cloneDeep(valid);
                delete invalid[0].sourceAddressPrefix;
                let errors = validation.validate({
                    settings: invalid,
                    validations: securityRulesValidations
                });

                expect(errors.length).toEqual(1);
                expect(errors[0].name).toEqual('[0].sourceAddressPrefix');
            });

            it('destinationAddressPrefix undefined', () => {
                let invalid = _.cloneDeep(valid);
                delete invalid[0].destinationAddressPrefix;
                let errors = validation.validate({
                    settings: invalid,
                    validations: securityRulesValidations
                });

                expect(errors.length).toEqual(1);
                expect(errors[0].name).toEqual('[0].destinationAddressPrefix');
            });

            it('sourcePortRange undefined', () => {
                let invalid = _.cloneDeep(valid);
                delete invalid[0].sourcePortRange;
                let errors = validation.validate({
                    settings: invalid,
                    validations: securityRulesValidations
                });

                expect(errors.length).toEqual(1);
                expect(errors[0].name).toEqual('[0].sourcePortRange');
            });

            it('destinationPortRange undefined', () => {
                let invalid = _.cloneDeep(valid);
                delete invalid[0].destinationPortRange;
                let errors = validation.validate({
                    settings: invalid,
                    validations: securityRulesValidations
                });

                expect(errors.length).toEqual(1);
                expect(errors[0].name).toEqual('[0].destinationPortRange');
            });

            it('access undefined', () => {
                let invalid = _.cloneDeep(valid);
                delete invalid[0].access;
                let errors = validation.validate({
                    settings: invalid,
                    validations: securityRulesValidations
                });

                expect(errors.length).toEqual(1);
                expect(errors[0].name).toEqual('[0].access');
            });

            it('protocol undefined', () => {
                let invalid = _.cloneDeep(valid);
                delete invalid[0].protocol;
                let errors = validation.validate({
                    settings: invalid,
                    validations: securityRulesValidations
                });

                expect(errors.length).toEqual(1);
                expect(errors[0].name).toEqual('[0].protocol');
            });
        });
    });

    describe('merge', () => {
        let nsgSettingsDefaults = nsgSettings.__get__('networkSecurityGroupSettingsDefaults');
        let mergeCustomizer = nsgSettings.__get__('mergeCustomizer');

        let networkSecurityGroup = {
            name: 'test-nsg',
            virtualNetworks: [
                {
                    name: 'my-virtual-network',
                    subnets: ['biz', 'web']
                }
            ],
            networkInterfaces: [
                {
                    name: 'my-nic1'
                }
            ],
            securityRules: [
                {
                    name: 'rule1',
                    direction: 'Inbound',
                    priority: 100,
                    sourceAddressPrefix: '192.168.1.1',
                    destinationAddressPrefix: '*',
                    sourcePortRange: '*',
                    destinationPortRange: '*',
                    access: 'Allow',
                    protocol: '*'
                }
            ]
        };

        it('virtualNetworks undefined', () => {
            let settings = _.cloneDeep(networkSecurityGroup);
            delete settings.virtualNetworks;
            let merged = validation.merge(settings, nsgSettingsDefaults, mergeCustomizer);
            expect(merged.virtualNetworks.length).toBe(0);
        });

        it('virtualNetworks null', () => {
            let settings = _.cloneDeep(networkSecurityGroup);
            settings.virtualNetworks = null;
            let merged = validation.merge(settings, nsgSettingsDefaults, mergeCustomizer);
            expect(merged.virtualNetworks.length).toBe(0);
        });

        it('virtualNetworks present', () => {
            let settings = _.cloneDeep(networkSecurityGroup);
            let merged = validation.merge(settings, nsgSettingsDefaults, mergeCustomizer);
            expect(merged.virtualNetworks[0].name).toBe('my-virtual-network');
        });

        it('networkInterfaces undefined', () => {
            let settings = _.cloneDeep(networkSecurityGroup);
            delete settings.networkInterfaces;
            let merged = validation.merge(settings, nsgSettingsDefaults, mergeCustomizer);
            expect(merged.networkInterfaces.length).toBe(0);
        });

        it('networkInterfaces null', () => {
            let settings = _.cloneDeep(networkSecurityGroup);
            settings.networkInterfaces = null;
            let merged = validation.merge(settings, nsgSettingsDefaults, mergeCustomizer);
            expect(merged.networkInterfaces.length).toBe(0);
        });

        it('networkInterfaces present', () => {
            let settings = _.cloneDeep(networkSecurityGroup);
            let merged = validation.merge(settings, nsgSettingsDefaults, mergeCustomizer);
            expect(merged.networkInterfaces[0].name).toBe('my-nic1');
        });

        it('securityRules undefined', () => {
            let settings = _.cloneDeep(networkSecurityGroup);
            delete settings.securityRules;
            let merged = validation.merge(settings, nsgSettingsDefaults, mergeCustomizer);
            expect(merged.securityRules.length).toBe(0);
        });

        it('securityRules null', () => {
            let settings = _.cloneDeep(networkSecurityGroup);
            settings.securityRules = null;
            let merged = validation.merge(settings, nsgSettingsDefaults, mergeCustomizer);
            expect(merged.securityRules.length).toBe(0);
        });

        it('securityRules present', () => {
            let settings = _.cloneDeep(networkSecurityGroup);
            let merged = validation.merge(settings, nsgSettingsDefaults, mergeCustomizer);
            expect(merged.securityRules[0].name).toBe('rule1');
        });
    });

    describe('transform', () => {
        let networkSecurityGroup = [
            {
                name: 'test-nsg',
                virtualNetworks: [
                    {
                        name: 'my-virtual-network',
                        subnets: ['biz', 'web']
                    }
                ],
                networkInterfaces: [
                    {
                        name: 'my-nic1'
                    }
                ],
                securityRules: [
                    {
                        name: 'rule1',
                        direction: 'Inbound',
                        priority: 100,
                        sourceAddressPrefix: '192.168.1.1',
                        destinationAddressPrefix: '*',
                        sourcePortRange: '*',
                        destinationPortRange: '*',
                        access: 'Allow',
                        protocol: '*'
                    }
                ]
            }
        ];

        let buildingBlockSettings = {
            subscriptionId: '00000000-0000-1000-8000-000000000000',
            resourceGroupName: 'test-rg'
        };

        it('single network security group', () => {
            let settings = _.cloneDeep(networkSecurityGroup);
            settings = settings[0];
            let result = nsgSettings.transform({
                settings: settings,
                buildingBlockSettings: buildingBlockSettings
            });

            expect(result.networkSecurityGroups.length).toBe(1);
            let settingsResult = result.networkSecurityGroups[0];
            expect(settingsResult.hasOwnProperty('id')).toBe(true);
            expect(settingsResult.name).toBe(settings.name);
            expect(settingsResult.hasOwnProperty('resourceGroupName')).toBe(true);
            expect(settingsResult.hasOwnProperty('subscriptionId')).toBe(true);
            
            expect(settingsResult.subnets.length).toBe(2);
            let subnetsResult = settingsResult.subnets;
            expect(subnetsResult[0].endsWith('my-virtual-network/subnets/biz')).toBe(true);
            expect(subnetsResult[1].endsWith('my-virtual-network/subnets/web')).toBe(true);

            expect(settingsResult.networkInterfaces.length).toBe(1);
            let nicsResult = settingsResult.networkInterfaces;
            expect(nicsResult[0].endsWith('networkInterfaces/my-nic1')).toBe(true);

            expect(settingsResult.properties.securityRules.length).toBe(1);
            let securityRulesResult = settingsResult.properties.securityRules;
            expect(securityRulesResult[0].name).toBe('rule1');
            expect(securityRulesResult[0].properties.direction).toBe('Inbound');
            expect(securityRulesResult[0].properties.priority).toBe(100);
            expect(securityRulesResult[0].properties.sourceAddressPrefix).toBe('192.168.1.1');
            expect(securityRulesResult[0].properties.destinationAddressPrefix).toBe('*');
            expect(securityRulesResult[0].properties.sourcePortRange).toBe('*');
            expect(securityRulesResult[0].properties.destinationPortRange).toBe('*');
            expect(securityRulesResult[0].properties.access).toBe('Allow');
            expect(securityRulesResult[0].properties.protocol).toBe('*');
        });

        it('test settings validation errors', () => {
            let settings = _.cloneDeep(networkSecurityGroup);
            delete settings[0].name;
            expect(() => {
                nsgSettings.transform({
                    settings: settings,
                    buildingBlockSettings: buildingBlockSettings
                });
            }).toThrow();
        });

        it('test building blocks validation errors', () => {
            let settings = _.cloneDeep(networkSecurityGroup);
            let bbSettings = _.cloneDeep(buildingBlockSettings);
            delete bbSettings.subscriptionId;
            expect(() => {
                nsgSettings.transform({
                    settings: settings,
                    buildingBlockSettings: bbSettings
                });
            }).toThrow();
        });
    });
});