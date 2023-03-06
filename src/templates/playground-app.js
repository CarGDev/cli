import { hot } from 'react-hot-loader';
import { SandboxComponent } from '@ivoyant/component-loader';

/* global CWD */
import React from 'react';

import { query, mock } from '@ivoyant/component-loader';
import instantiator from 'json-schema-instantiator';

const { sourceField, computedField } = query;

const App = () => {
    const { component, schema } = require(CWD + '/src/index').default;
    const url =
        'http://does-not-exist/fake-data?startDate=2018-09-18T00:00:00.000Z&endDate=2018-09-25T23:59:59.999Z&step=1m&fields=timestamp&fields=type:phone,pc,tablet,bearer&fields=location:New York,Bangalore,London,Moscow,Paris&fields=ram&fields=model:commerce.productName&fields=version:system.semver&limit=100';
    const datasource = [
        sourceField('type', 'string'),
        sourceField('timestamp', 'date'),
        sourceField('ram', 'number'),
        sourceField('location', 'string'),
        sourceField('model', 'string'),
        sourceField('version', 'string'),
        computedField('ram/100 as ComputedRam'),
    ];
    const properties = instantiator.instantiate(schema);
    mock();

    const props = {
        component: component,
        datasource,
        url,
        properties,
    };

    return React.createElement(SandboxComponent, props);
};
export const SandboxComponentHot = hot(module)(App);
