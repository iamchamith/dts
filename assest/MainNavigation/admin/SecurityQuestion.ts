module SecurityQuestion {


    $(function () {

        init.loadCurrentSecurityInfo();
 
    })

    var init = {

        loadCurrentSecurityInfo: function () {

            new apiConnector().callservice('/MainNavigation/SecurityQuestion/CurrentSecurity', null).done(function (e) {
 
                var val = {
                    q1: e[0],
                    q2: e[1],
                    q3 : e[2]
                }
                kendo.bind('#example', val);
            });
        }
    }


    class apiConnector extends JTypeScipt.apiConnector { }
}