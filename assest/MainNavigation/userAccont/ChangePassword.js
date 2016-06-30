var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ChangePassword;
(function (ChangePassword) {
    $(function () {
        $('#btnChangePassword').click(function () {
            new serverConnector().callservicePost("/UserAccount/ChangePassword", {
                NewPassword: $('#txtNewPassword').val(),
                ConfimNewPassowrd: $('#txtConfirmNewPassword').val(),
                OldPassword: $('#txtCurrentPassword').val()
            })
                .done(function (e) {
                console.log(e);
                alert(JSON.stringify(e));
            });
        });
    });
    var serverConnector = (function (_super) {
        __extends(serverConnector, _super);
        function serverConnector() {
            _super.apply(this, arguments);
        }
        return serverConnector;
    }(JTypeScipt.apiConnector));
})(ChangePassword || (ChangePassword = {}));
//# sourceMappingURL=ChangePassword.js.map