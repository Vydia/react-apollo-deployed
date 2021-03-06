import { Children } from 'react';
var assign = require('object-assign');
export function walkTree(element, context, visitor) {
    if (Array.isArray(element)) {
        element.forEach(function (item) { return walkTree(item, context, visitor); });
        return;
    }
    if (element === null)
        return;
    var Component = element.type;
    if (typeof Component === 'function') {
        var props = assign({}, Component.defaultProps, element.props);
        var childContext = context;
        var child = void 0;
        if (Component.prototype && Component.prototype.isReactComponent) {
            var _component = Component;
            var instance_1 = new _component(props, context);
            instance_1.props = instance_1.props || props;
            instance_1.context = instance_1.context || context;
            instance_1.state = instance_1.state || null;
            instance_1.setState = function (newState) {
                if (typeof newState === 'function') {
                    newState = newState(instance_1.state, instance_1.props, instance_1.context);
                }
                instance_1.state = assign({}, instance_1.state, newState);
            };
            if (instance_1.componentWillMount) {
                instance_1.componentWillMount();
            }
            if (instance_1.getChildContext) {
                childContext = assign({}, context, instance_1.getChildContext());
            }
            if (visitor(element, instance_1, context) === false) {
                return;
            }
            child = instance_1.render();
        }
        else {
            if (visitor(element, null, context) === false) {
                return;
            }
            var _component = Component;
            child = _component(props, context);
        }
        if (child) {
            if (Array.isArray(child)) {
                child.forEach(function (item) { return walkTree(item, context, visitor); });
            }
            else {
                walkTree(child, childContext, visitor);
            }
        }
    }
    else {
        if (visitor(element, null, context) === false) {
            return;
        }
        if (element.props && element.props.children) {
            Children.forEach(element.props.children, function (child) {
                if (child) {
                    walkTree(child, context, visitor);
                }
            });
        }
    }
}
function getQueriesFromTree(_a, fetchRoot) {
    var rootElement = _a.rootElement, _b = _a.rootContext, rootContext = _b === void 0 ? {} : _b;
    if (fetchRoot === void 0) { fetchRoot = true; }
    var queries = [];
    walkTree(rootElement, rootContext, function (element, instance, context) {
        var skipRoot = !fetchRoot && element === rootElement;
        if (instance && typeof instance.fetchData === 'function' && !skipRoot) {
            var query = instance.fetchData();
            if (query) {
                queries.push({ query: query, element: element, context: context });
                return false;
            }
        }
    });
    return queries;
}
export function getDataFromTree(rootElement, rootContext, fetchRoot) {
    if (rootContext === void 0) { rootContext = {}; }
    if (fetchRoot === void 0) { fetchRoot = true; }
    var queries = getQueriesFromTree({ rootElement: rootElement, rootContext: rootContext }, fetchRoot);
    if (!queries.length)
        return Promise.resolve();
    var errors = [];
    var mappedQueries = queries.map(function (_a) {
        var query = _a.query, element = _a.element, context = _a.context;
        return query
            .then(function (_) { return getDataFromTree(element, context, false); })
            .catch(function (e) { return errors.push(e); });
    });
    return Promise.all(mappedQueries).then(function (_) {
        if (errors.length > 0) {
            var error = errors.length === 1
                ? errors[0]
                : new Error(errors.length + " errors were thrown when executing your GraphQL queries.");
            error.queryErrors = errors;
            throw error;
        }
    });
}
//# sourceMappingURL=getDataFromTree.js.map