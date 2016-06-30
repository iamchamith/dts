module Deparments {

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
                $('#grid').data("kendoGrid").setDataSource(new kendo.data.DataSource({data : e}));
            });

        },
        updateDepartment: function () { },
        createDepetment: function () { }
    };


    class serviceConnector extends JTypeScipt.apiConnector { }
}