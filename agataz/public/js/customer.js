frappe.ui.form.on("Customer", {
    after_save: function (frm) {
    frappe.call({
        method: "agataz.doc_event.agataz.add_customer",
        args: { 
          doc_name: frm.doc.name,
        },
        callback: function (response) {
          if (response.message) {  
            frm.refresh_field("custom_customer_vessels");
          }
        }
      });
    }
})