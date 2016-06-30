module ChangeSecurityQuestion {

    $(function () {

        init.initControlles();
        init.looksUp();
    });

    var init = {

        initControlles: function () {

            $('#ddQ1').kendoComboBox({ dataTextField: 'text', dataValueField:'value' });
            $('#ddQ2').kendoComboBox({ dataTextField: 'text', dataValueField: 'value' });
            $('#ddQ3').kendoComboBox({ dataTextField: 'text', dataValueField: 'value' });
            $('#btnSubmit').bind('click', crud.saveInfo);
        },
        looksUp: function () {

            new apiConnector().callservice('/MainNavigation/SecurityQuestion/LooksUp',null).done(function (e) {

                $('#ddQ1').data("kendoComboBox").setDataSource(new kendo.data.DataSource({ data: e.q1 }));
                $('#ddQ2').data("kendoComboBox").setDataSource(new kendo.data.DataSource({ data: e.q1 }));
                $('#ddQ3').data("kendoComboBox").setDataSource(new kendo.data.DataSource({ data: e.q1 }));
            });
        }
    }

    var crud = {

        saveInfo: function () {

            var arr = [];
            arr.push( $('#ddQ1').data("kendoComboBox").value());
            arr.push( $('#ddQ2').data("kendoComboBox").value());
            arr.push($('#ddQ3').data("kendoComboBox").value());
            var index = arr.length;
            if ($.unique(arr).length != index) {

                alert('dont repete questions'); return;
            }

            new apiConnector().callservicePost('/MainNavigation/SecurityQuestion/Save',
                [
                    { Question: $('#ddQ1').data("kendoComboBox").value(), Answer: $('#txtQ1').val() },
                    { Question: $('#ddQ2').data("kendoComboBox").value(), Answer: $('#txtQ2').val() },
                    { Question: $('#ddQ3').data("kendoComboBox").value(), Answer: $('#txtQ3').val()  }
                ]
            ).done(function (e) {

                alert(JSON.stringify(e));
            });
        }
    }

    class apiConnector extends JTypeScipt.apiConnector { }
}