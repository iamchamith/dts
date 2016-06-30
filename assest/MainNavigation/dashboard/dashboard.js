/// <reference path="../../comman.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Dashboard;
(function (Dashboard) {
    var CustomerInfoUrl = "/Mainnavigation/home/GetCustomerInfo";
    var lookupInfoUrl = "/Mainnavigation/home/Lookup";
    var newsUrl = "/Mainnavigation/home/GetNews";
    $(function () {
        LoadControllers();
        serviceConnector.getLookups();
        serviceConnector.getuserDashboardInfo();
        serviceConnector.getNews({ State: 0, Index: 0 });
    });
    function LoadControllers() {
        $("#ddState").kendoDropDownList({ dataTextField: "Text", dataValueField: "Value", select: function (e) { Events.ddStateSelect(e); } });
    }
    var Events = {
        ddStateSelect: function (e) {
            serviceConnector.getNews({ State: $("#ddState").data("kendoDropDownList").value(), Index: 0 });
        }
    };
    var serviceConnector = {
        getuserDashboardInfo: function () {
            new ServiceConnector().callservice(CustomerInfoUrl, null)
                .done(function (data) {
                console.log(data);
                kendo.bind($("#div_customer_info"), data.customer);
            }).fail(function () {
                console.log('error');
            });
        },
        getLookups: function () {
            new ServiceConnector().callservice(lookupInfoUrl, null)
                .done(function (data) {
                console.log(data);
                $("#ddState").data("kendoDropDownList").setDataSource(new kendo.data.DataSource({
                    data: data.status
                }));
            }).fail(function () {
                console.log('error');
            });
        },
        getNews: function (e) {
            new ServiceConnector().callservice(newsUrl, e)
                .done(function (data) {
                console.log(data);
                $("#newsList").kendoListView({
                    dataSource: data.news,
                    template: kendo.template($("#newsListTemplate").html())
                });
            }).fail(function () {
                console.log('error');
            });
        }
    };
    var ServiceConnector = (function (_super) {
        __extends(ServiceConnector, _super);
        function ServiceConnector() {
            _super.apply(this, arguments);
        }
        return ServiceConnector;
    }(JTypeScipt.apiConnector));
})(Dashboard || (Dashboard = {}));
//# sourceMappingURL=dashboard.js.map