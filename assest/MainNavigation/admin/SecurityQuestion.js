var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SecurityQuestion;
(function (SecurityQuestion) {
    $(function () {
        init.loadCurrentSecurityInfo();
    });
    var init = {
        loadCurrentSecurityInfo: function () {
            new apiConnector().callservice('/MainNavigation/SecurityQuestion/CurrentSecurity', null).done(function (e) {
                var val = {
                    q1: e[0],
                    q2: e[1],
                    q3: e[2]
                };
                kendo.bind('#example', val);
            });
        }
    };
    var apiConnector = (function (_super) {
        __extends(apiConnector, _super);
        function apiConnector() {
            _super.apply(this, arguments);
        }
        return apiConnector;
    }(JTypeScipt.apiConnector));
})(SecurityQuestion || (SecurityQuestion = {}));
//# sourceMappingURL=SecurityQuestion.js.map