module ChangePassword {


    $(function () {

        $('#btnChangePassword').click(function () {

            new serverConnector().callservicePost("/UserAccount/ChangePassword",
                {
                    NewPassword: $('#txtNewPassword').val(),
                    ConfimNewPassowrd: $('#txtConfirmNewPassword').val(),
                    OldPassword: $('#txtCurrentPassword').val()
                })
                .done(function (e) {

                    console.log(e);
                    alert(JSON.stringify(e));
            });

        });
    })


    class serverConnector extends JTypeScipt.apiConnector{ }
}