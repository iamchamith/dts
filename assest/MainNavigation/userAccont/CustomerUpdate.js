var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CustomerUpdate;
(function (CustomerUpdate) {
    $(function () {
        init.initControlles();
        lookups.loadLookups("");
    });
    var init = {
        initControlles: function () {
        }
    };
    var lookups = {
        loadLookups: function (url) {
            new ServerConnector().callservice(url, null).done(function (e) {
                kendo.bind('', e.content);
            });
        },
    };
    var customerCrud = {
        loadCustomer: function (url) {
            new ServerConnector().callservice(url, null).done(function (e) {
                kendo.bind('', e.content);
            });
        },
        updateCustomer: function (url) {
            new ServerConnector().callservice(url, null).done(function (e) {
                alert(JSON.stringify(e));
            });
        }
    };
    var ServerConnector = (function (_super) {
        __extends(ServerConnector, _super);
        function ServerConnector() {
            _super.apply(this, arguments);
        }
        return ServerConnector;
    }(JTypeScipt.apiConnector));
})(CustomerUpdate || (CustomerUpdate = {}));
//# sourceMappingURL=CustomerUpdate.js.map