var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Home;
(function (Home) {
    var CustomerInfoUrl = "/Mainnavigation/home/GetCustomerInfo";
    $(function () {
        new serverConnector().callservice(CustomerInfoUrl, null).done(function (data) {
            kendo.bind('#div_customer_info_bind', data.customer);
        });
    });
    var serverConnector = (function (_super) {
        __extends(serverConnector, _super);
        function serverConnector() {
            _super.apply(this, arguments);
        }
        return serverConnector;
    }(JTypeScipt.apiConnector));
    ;
})(Home || (Home = {}));
//# sourceMappingURL=home.js.map