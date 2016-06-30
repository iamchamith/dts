var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ItemView;
(function (ItemView_1) {
    $((function () {
        init.initControlles();
        lookups.initLookups();
        ItemView.loadItem();
    }));
    var init = {
        initControlles: function () {
            $('#ddItemType').kendoDropDownList({ dataTextField: "ItemType", dataValueField: "TypeId" });
            $('#ddCategory').kendoDropDownList({ dataTextField: "ItemCategory", dataValueField: "CategoryId" });
            $('#ddFacility').kendoDropDownList({ dataTextField: "Facility", dataValueField: "Id" });
            $('#grid').kendoGrid({
                columns: [
                    { field: "ItemRef" },
                    { field: "ItemType" },
                    { field: "ItemName" },
                    { field: "ItemCategory" },
                    { field: "FacilityName" },
                    { field: "AvailableTo" },
                    { field: "AvailableFrom" },
                    //{ field: "IsActive", template: "# if(IsActive) { # active# } else #{# not active #}#." },
                    {
                        command: [
                            {
                                name: "Delete",
                                click: function (e) {
                                    // command button click handler
                                }
                            },
                            { name: "Edit" } // built-in "destroy" command
                        ]
                    }
                ],
                pageable: {
                    pageSize: 20,
                }
            });
        }
    };
    var lookups = {
        initLookups: function () {
            new serverConnector().callservice("/Admin/Items/ViewItemLookUps", null).done(function (e) {
                console.log(e);
                $('#ddCategory').data("kendoDropDownList").setDataSource(new kendo.data.DataSource({ data: e.cat }));
                $('#ddFacility').data("kendoDropDownList").setDataSource(new kendo.data.DataSource({ data: e.facility }));
                $('#ddItemType').data("kendoDropDownList").setDataSource(new kendo.data.DataSource({ data: e.type }));
            });
        }
    };
    var ItemView = {
        loadItem: function () {
            new serverConnector().callservice("/Admin/Items/ViewItemInfo", null).done(function (e) {
                console.log(e);
                $('#grid').data("kendoGrid").setDataSource(new kendo.data.DataSource({ data: e.content }));
            });
        }
    };
    var serverConnector = (function (_super) {
        __extends(serverConnector, _super);
        function serverConnector() {
            _super.apply(this, arguments);
        }
        return serverConnector;
    }(JTypeScipt.apiConnector));
})(ItemView || (ItemView = {}));
//# sourceMappingURL=ItemView.js.map