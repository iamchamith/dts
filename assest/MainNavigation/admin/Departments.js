var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Deparments;
(function (Deparments) {
    $(function () {
        init.intitControlles();
        departmentCrud.getDepartments();
    });
    var init = {
        intitControlles: function () {
            $('#grid').kendoGrid({
                editable: "popup",
                columns: [
                    { field: "Id" },
                    { field: "Name" },
                    { command: ["edit", "destroy"] }
                ]
            });
        }
    };
    var departmentCrud = {
        getDepartments: function () {
            new serviceConnector().callservice("/Admin/ManegeStaff/GetDepartments", null).done(function (e) {
                console.log(e);
                $('#grid').data("kendoGrid").setDataSource(new kendo.data.DataSource({ data: e }));
            });
        },
        updateDepartment: function () { },
        createDepetment: function () { }
    };
    var serviceConnector = (function (_super) {
        __extends(serviceConnector, _super);
        function serviceConnector() {
            _super.apply(this, arguments);
        }
        return serviceConnector;
    }(JTypeScipt.apiConnector));
})(Deparments || (Deparments = {}));
//# sourceMappingURL=Departments.js.map