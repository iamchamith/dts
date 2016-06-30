var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EventDetailView;
(function (EventDetailView) {
    var dataLength = 0;
    var startPos = 0;
    $(document).ready(function () {
        $("#userGroup").before("yahoo");
        var _form = new form();
        _form.bindValues(0);
        infiniteLoad();
        function infiniteLoad() {
            $(window).on('scroll', function () {
                var h1 = $(document).height() - $(window).height();
                var h2 = $(window).scrollTop() + 350;
                if (h2 >= h1 && dataLength > 0) {
                    startPos = startPos + 6 - 1;
                    new form().bindValues(startPos);
                }
            });
        }
    });
    var form = (function () {
        function form() {
        }
        form.prototype.bindValues = function (val) {
            var f = new form();
            new apiServerConnector().callservice('/Events/Events/GetPosts', { begin: val })
                .done(function (data) {
                // bind users
                var template = kendo.template($("#lstSubAccounts").html());
                var dataSource = new kendo.data.DataSource();
                dataSource.data(data);
                $.each(dataSource.data(), function (i, d) {
                    console.log(template(d));
                    $("#userGroup").before(template(d));
                });
                dataSource.read();
                dataLength = data.length;
            }).fail(function () {
                console.log('error');
            });
        };
        return form;
    }());
    EventDetailView.form = form;
    var apiServerConnector = (function (_super) {
        __extends(apiServerConnector, _super);
        function apiServerConnector() {
            _super.apply(this, arguments);
        }
        return apiServerConnector;
    }(JTypeScipt.apiConnector));
})(EventDetailView || (EventDetailView = {}));
//# sourceMappingURL=eventView.js.map