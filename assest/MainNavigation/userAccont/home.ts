module Home {

    const CustomerInfoUrl = "/Mainnavigation/home/GetCustomerInfo";
    $(function () {


        new serverConnector().callservice(CustomerInfoUrl, null).done(function (data) {

            kendo.bind('#div_customer_info_bind', data.customer);

        });

    });




    class serverConnector extends JTypeScipt.apiConnector { };
}