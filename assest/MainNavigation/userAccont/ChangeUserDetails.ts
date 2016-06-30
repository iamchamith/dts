module ChangeUserDetails {

    $(function () {

        init.initControlles();
        lookup.loadLookups();
        userCrud.getUserInfo();

        $('#btnbtnSave').click(function () {
            alert();
            userCrud.updateUser();
        });
    })

    var init = {

        initControlles: function () {
            
            var d = new Date();
            var x = d.setDate(new Date().getDate() - 6570);
            $('#datePicker').kendoDatePicker({ max: new Date() });
            $('#ddCountry').kendoDropDownList({ dataTextField: "Text", dataValueField: "Value" }).val("0");
            $('#txtPhone').kendoMaskedTextBox();
          

        },
        events: function () {


        }

    };

    var userCrud = {

        getUserInfo: function () {
            new serviceConnector().callservice("/MainNavigation/UserAccount/GetCustomerInfo", null).done(function (e) {
                kendo.bind("#frmUserDetails", e.content);
            });
        },
        updateUser: function () {

            new serviceConnector().callservicePost("/MainNavigation/UserAccount/EditUserInfo",
                {
                    Name: $('#txtName').val(),
                    Address: $('#txtAddress').val(),
                    BirthDay: $('#datePicker').data("kendoDatePicker").value(),
                    Email: $('#txtEmail').val(),
                    Phone : $('#txtPhone').val()
                })
                .done(function (e) {

                    alert(JSON.stringify(e));
            });
        }
    }

    var lookup = {

        loadLookups: function () {

            new serviceConnector().callservice("/MainNavigation/Lookups/Country", null).done(function (e) {
                console.log('lookups');
                console.log(e);

                $('#ddCountry').data("kendoDropDownList").setDataSource(new kendo.data.DataSource({ data: e.Content }));
            });
        }
    }


    class serviceConnector extends JTypeScipt.apiConnector { };
}