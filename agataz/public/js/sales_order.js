frappe.ui.form.on("Sales Order", {
    custom_vessel: function(frm) {
        if (!frm.doc.custom_vessel) return;

        frappe.db.get_doc('Customer', frm.doc.customer).then(doc => {
            let vessel = doc.custom_customer_vessels.find(row => row.name === frm.doc.custom_vessel);
            if (vessel) {
                frm.set_value('custom_imo_numer', vessel.imo_number);
                frm.set_value('custom_port', vessel.port);
                frm.set_value('custom_flag', vessel.flag);
            }
        });
    },
    
    customer: function(frm) {
        frm.set_query("custom_vessel", function() {
            return {
                "filters": [
                    ["Vessels", "parent", "=", frm.doc.customer]
                ]
            };
        }); 
    }
});
