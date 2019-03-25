'use strict';

const get = require('lodash/get');
const set = require('lodash/set');
const transform = require('lodash/transform');

module.exports = {
    go: ({source = {}, mapper = {}, target = {}} = {}, {generalDefaultValue} = {}) => {
    
        return transform(mapper, (result, sourceOptions, targetPath) => {

            let [
                sourcePath,
                defaultPathValue = generalDefaultValue,
                execDefaultValueFunction = true
            ] = Array.isArray(sourceOptions) ? sourceOptions : [sourceOptions];

            let proxy = v => v;

            const getSourcePathValue = (sourcePathToGet) => get(source, sourcePathToGet, defaultPathValue);
            const setTargetPathValue = (targetValueToSet) => set(result, targetPath, proxy(targetValueToSet));

            // "target.path": () => ... || [() => ...]
            if (typeof sourcePath === 'function') {
                proxy = sourcePath;
                return setTargetPathValue();
            } else if (typeof defaultPathValue === 'function' && execDefaultValueFunction === true) {
                proxy = defaultPathValue;
                defaultPathValue = generalDefaultValue;
            };

            // "target.path": 1 || true || [1, ...] || [true, ...]
            if(sourcePath === true || sourcePath === 1){
                return setTargetPathValue(getSourcePathValue(targetPath));
            }

            // "target.path": "source.path"
            if(typeof sourcePath === 'string'){
                return setTargetPathValue(getSourcePathValue(sourcePath));
            }

            // "target.path": null || [null, ...]
            if(sourcePath === null){
                return setTargetPathValue(defaultPathValue);
            }

            return result;
    
        }, target);
    }
}
