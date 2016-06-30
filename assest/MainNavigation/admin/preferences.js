var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var preferences;
(function (preferences) {
    $(function () {
        init.initControllers();
        init.lookups();
        crud.loadCustomerInfo(199);
    });
    var init = {
        initControllers: function () {
            $('#ddFormat').kendoComboBox({
                dataSource: new kendo.data.DataSource({
                    data: [
                        { text: 'Select Date Foramt', value: '0' },
                        { text: 'dd/MM/yyyy', value: '1' },
                        { text: 'yyyy/MM/dd', value: '2' },
                        { text: 'yyyy/dd/MM', value: '3' },
                        { text: 'MM/dd/yyyy', value: '4' },
                    ]
                }), dataTextField: 'text', dataValueField: 'value', index: 0
            });
            $('#ddGridFormat').kendoComboBox({
                dataSource: new kendo.data.DataSource({
                    data: [
                        { text: 'select grid data format', value: '0' },
                        { text: '{0:dd/MM/yyyy}', value: '1' },
                        { text: '{0:yyyy/MM/dd}', value: '2' },
                        { text: '{0:yyyy/dd/MM}', value: '3' },
                        { text: '{0:MM/dd/yyyy}', value: '4' },
                    ]
                }),
                dataTextField: 'text',
                dataValueField: 'value',
                index: 0
            });
            $('#ddUserTimeZone').kendoComboBox({ index: 0, dataTextField: 'text', dataValueField: 'value' });
            $('#btnSave').bind('click', crud.saveCustomerInfo);
        },
        lookups: function () {
            new ServiceConnector().callservice('/MainNavigation/Preference/LookUp', null).done(function (e) {
                $('#ddUserTimeZone').data("kendoComboBox").setDataSource(new kendo.data.DataSource({ data: e.data }));
            });
        }
    };
    var crud = {
        loadCustomerInfo: function (customerID) {
            new ServiceConnector().callservice('/MainNavigation/Preference/GetPreference', { customerId: customerID }).done(function (e) {
                $('#ddFormat').data('kendoComboBox').value(e.dateFormat);
                $('#ddGridFormat').data('kendoComboBox').value(e.gridFormat);
                $('#ddUserTimeZone').data('kendoComboBox').value(e.timeZone);
                $('#chkNews').prop("checked", e.news);
                $('#chkSuccess').prop("checked", e.success);
                $('#chkWarning').prop("checked", e.warning);
                $('#chkNotice').prop("checked", e.notise);
                console.log(e.customerId);
            });
        },
        saveCustomerInfo: function () {
            swal({
                title: "Ajax request example",
                text: "Submit to run ajax request",
                type: "info", showCancelButton: true,
                closeOnConfirm: false, showLoaderOnConfirm: true,
            }, function () {
                new ServiceConnector().callservicePost('/MainNavigation/Preference/Save', {
                    customerId: 119,
                    dateFormat: $('#ddFormat').data('kendoComboBox').value(),
                    gridFormat: $('#ddGridFormat').data('kendoComboBox').value(),
                    timeZone: $('#ddUserTimeZone').data('kendoComboBox').value(),
                    news: $('#chkNews').is(":checked"),
                    success: $('#chkSuccess').is(":checked"),
                    warning: $('#chkWarning').is(":checked"),
                    notise: $('#chkNotice').is(":checked")
                })
                    .done(function (e) {
                    swal({ title: "HTML <small>response</small>!", text: '<p>' + JSON.stringify(e) + '</p>', html: true });
                });
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
})(preferences || (preferences = {}));
//# sourceMappingURL=preferences.js.map